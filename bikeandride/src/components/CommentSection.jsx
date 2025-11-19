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
import { useAuth } from "../context/AuthContext";
import {
    getComments,
    addComments,
    updateComments,
    deleteComments,
} from "../services/commentService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatDateToSpanish } from "../utils/dateUtils";

dayjs.extend(relativeTime);
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

    useEffect(() => {
        loadComments();
    }, [activityId]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const data = await getComments(activityId);
            setComments(data);
        }catch (error){
            console.error("Error loading comments: ", error);
            message.error("Error al cargar los comentarios");
        }finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            message.warning("Escribe un comentario");
            return;
        }

        try {
            setSubmitting(true);
            await addComments(activityId, newComment.trim());
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
            await updateComments(commentId, editingText.trim());
            message.success("Comentario actualizado");
            setEditingCommentId(null);
            setEditingText("");
            loadComments();
        } catch (error) {
            console.error("Error updating comment: ", error);
            message.error(error.message || "Error al actualizar el comentario");
        }
    };

    
}