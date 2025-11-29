import React, { useState, useEffect } from "react";
import {
    Card,
    List,
    Input,
    Button,
    Avatar,
    Space,
    Popconfirm,
    message,
    Empty,
    Spin,
    Typography,
} from "antd";
import {
    UserOutlined,
    SendOutlined,
    DeleteOutlined,
    EditOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import {
    getComments,
    addComment as addCommentService,
    updateComment as updateCommentService,
    deleteComment as deleteCommentService,
} from "../services/commentService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { formatDateToSpanish } from "../utils/dateUtils";
import { getProfileImage } from "../services/imageService";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.locale("es");

const { TextArea } = Input;
const { Text } = Typography;

function CommentSection({ activityId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [userImages, setUserImages] = useState({});

    useEffect(() => {
        loadComments();
    }, [activityId]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const data = await getComments(activityId);
            console.log("Comentarios recibidos: ", data)
            setComments(data);

            const uniqueUsersId = [...new Set(data.map(c => c.idUsuario))];
            const images = {};

            await Promise.all(
                uniqueUsersId.map(async (userId) => {
                    try{
                        const imageUrl = await getProfileImage(userId);
                        images[userId] = imageUrl;
                    }catch {
                        console.log(`No hay imagenes para ${userId}`);
                        images[userId] = null;
                    }
                })
            );
            setUserImages(images);
        }catch (error){
            console.error("Error loading comments: ", error);
            message.error("Error al cargar los comentarios");
        }finally {
            setLoading(false);
        }
    };

    const getUserName = (userId) => {
        if (userId === user?.idUser) {
            return user?.name || "Tú";
        }
        return `Usuario #${userId}`;
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            message.warning("Escribe un comentario");
            return;
        }

        try {
            setSubmitting(true);
            await addCommentService(activityId, newComment.trim());
            message.success("Comentario añadido");
            setNewComment();
            loadComments();
        }catch (error) {
            console.error("Error adding comment: ", error);
            message.error(error.message || "Error al añadir el comentario");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editingText.trim()) {
            message.warning("El comentario no puede estar vacio");
            return;
        }

        try {
            await updateCommentService(commentId, editingText.trim());
            message.success("Comentario actualizado");
            setEditingCommentId(null);
            setEditingText("");
            loadComments();
        } catch (error) {
            console.error("Error updating comment: ", error);
            message.error(error.message || "Error al actualizar el comentario");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteCommentService (commentId);
            message.success("Comentario editado");
            loadComments();
        }catch (error) {
            console.error("Error deleting: ", error);
            message.error(error.message || "Error al eliminar el comentario");
        }
    };

    const startEditing = (comment) => {
        setEditingCommentId(comment.idComentario);
        setEditingText(comment.comentario);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditingText("");
    };

    if (loading) {
        return (
            <Card>
                <div style={{ textAlign: "center", padding:"40px" }}>
                    <Spin size="large" />
                </div>
            </Card>
        );
    }

    return (
        <Card
            title={
                <Space>
                    <MessageOutlined  style={{ color: "#1890ff "}} />
                    <span>Comentarios ({comments.length})</span>
                </Space>
            }
        >
            {/* Añadimos un formulario apra añadir comentarios */}
            <div style={{ marginBottom: "24px" }}>
                <Space.Compact style={{ width: "100%"}}>
                    <TextArea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tu comentario..."
                        autoSize={{ minRows:2, maxRows:4}}
                        onPressEnter={(e) => {
                            if (e.shiftKey) return; // Permitimos shift + enter para bajar una linea
                            e.preventDefault();
                            handleAddComment();
                        }}
                    />
                </Space.Compact>
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleAddComment}
                    loading={submitting}
                    style={{ marginTop: "8px", float:"right"}}
                >
                    Comentar
                </Button>
                <div style={{ clear: "both"}} />
            </div>

            {/** Añadimos la lista de los comentarios */}
            {comments.length === 0 ? (
                <Empty
                    description="No hay comentarios todavía, a que esperas!"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <List
                    dataSource={comments}
                    renderItem={(comment) => {
                        const isOwner = user?.idUser === comment.idUsuario;
                        const isEditing = editingCommentId === comment.idComentario;

                        return (
                            <List.Item
                                key={comment.idComentario}
                                actions={
                                    isOwner ? [
                                        isEditing ? (
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={() => handleEditComment(comment.idComentario)}
                                            >
                                                Guardar
                                            </Button>
                                        ) : (
                                            <Button
                                                type="link"
                                                size="small"
                                                icon={<EditOutlined />}
                                                onClick={() => startEditing(comment)}
                                            >
                                                Editar
                                            </Button>
                                        ),
                                        isEditing ? (
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={cancelEditing}
                                            >
                                                Cancelar
                                            </Button>
                                        ) : (
                                            <Popconfirm
                                                title="¿Desea eliminar el comentario?"
                                                description="Esta acción no se puede deshacer"
                                                onConfirm={() => handleDeleteComment(comment.idComentario)}
                                                okText="Eliminar"
                                                cancelText="Cancelar"
                                                okButtonProps={{ danger: true}}
                                            >
                                                Eliminar
                                            </Popconfirm>
                                        ),
                                    ]
                                : []
                                }
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            style={{ 
                                                backgroundColor: userImages[comment.idUsuario] ? "transparent" : "#1890ff",
                                                border: userImages[comment.idUsuario] ? "2px solid #f0f0f0" : "none"
                                            }}
                                            icon={!userImages[comment.idUsuario] && !getUserName(comment.idUsuario) ? <UserOutlined /> : null}
                                            src={userImages[comment.idUsuario]}
                                        >
                                            {!userImages[comment.idUsuario] && getUserName(comment.idUsuario) 
                                                ? getUserName(comment.idUsuario).charAt(0).toUpperCase() 
                                                : null}
                                        </Avatar>
}
                                    title={
                                        <Space>
                                            <Text strong>{getUserName(comment.idUsuario)}</Text>
                                            <Text type="secondary" style={{ fontSize: "12px"}}>
                                                {comment.fecha
                                                    ? dayjs(comment.fecha).isSame(dayjs(), 'day')
                                                        ? "Hoy"
                                                        : dayjs(comment.fecha).fromNow()
                                                    : "Hace un momento"}
                                            </Text>
                                        </Space>
                                    }
                                    description={
                                        isEditing ? (
                                            <TextArea
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                autoSize={{ minRows: 2, maxRows: 4}}
                                                style={{ margin: "8px"}}
                                            />
                                        ) : (
                                            <div style={{ whiteSpace: "pre-wrap", marginTop: "8px"}}>
                                                {comment.comentario}
                                            </div>
                                        )
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            )}
        </Card>
    );  
}

export default CommentSection;