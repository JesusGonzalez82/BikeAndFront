import React from "react";
import { Carousel } from "antd";
import { KilometersChartGlow } from "./KilometersChartGlow";
import { SpeedChartGlow } from "./SpeedChartGlow";
import { CaloriesChartGlow } from "./CaloriesChartGlow";
import { ElevationChartGlow } from "./ElevationChartGlow";

export function ChartsCarousel(){
    return (
        <div style={{ marginBottom: "32px", width: "100%", overflow: "hidden" }}>
            <style>
                {`
                    .ant-carousel .slick-dots {
                        bottom: -40px !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: center !important;
                    }
                    
                    .ant-carousel .slick-dots li {
                        margin: 0 8px !important;
                        width: auto !important;
                        height: auto !important;
                    }
                    
                    .ant-carousel .slick-dots li button {
                        width: 12px !important;
                        height: 12px !important;
                        border-radius: 50% !important;
                        background: #64748b !important;
                        border: none !important;
                        opacity: 1 !important;
                        transition: all 0.3s ease !important;
                    }
                    
                    .ant-carousel .slick-dots li button:hover {
                        background: #475569 !important;
                        transform: scale(1.2) !important;
                    }
                    
                    .ant-carousel .slick-dots li.slick-active button {
                        width: 16px !important;
                        height: 16px !important;
                        background: #52c41a !important;
                        box-shadow: 0 0 10px rgba(82, 196, 26, 0.5) !important;
                    }

                    /* Flechas de navegación */
                    .ant-carousel .slick-prev,
                    .ant-carousel .slick-next {
                        color: #52c41a !important;
                        font-size: 30px !important;
                        z-index: 10 !important;
                        width: 40px !important;
                        height: 40px !important;
                    }
                    
                    .ant-carousel .slick-prev::before,
                    .ant-carousel .slick-next::before {
                        color: #52c41a !important;
                        font-size: 30px !important;
                    }
                    
                    .ant-carousel .slick-prev {
                        left: 10px !important;
                    }
                    
                    .ant-carousel .slick-next {
                        right: 10px !important;
                    }
                    
                    .ant-carousel .slick-prev:hover::before,
                    .ant-carousel .slick-next:hover::before {
                        color: #73d13d !important;
                    }

                    /* Responsive para móviles */
                    @media (max-width: 768px) {
                        .ant-carousel .slick-prev,
                        .ant-carousel .slick-next {
                            font-size: 24px !important;
                            width: 32px !important;
                            height: 32px !important;
                        }
                        
                        .ant-carousel .slick-prev::before,
                        .ant-carousel .slick-next::before {
                            font-size: 24px !important;
                        }
                        
                        .ant-carousel .slick-prev {
                            left: 5px !important;
                        }
                        
                        .ant-carousel .slick-next {
                            right: 5px !important;
                        }
                    }
                `}
            </style>
            
            <Carousel 
                autoplay={false}
                dots={true}
                dotPosition="bottom"
                arrows={true}
                style={{
                    backgroundColor: "transparent",
                    paddingBottom: "20px",
                    maxWidth: "100%",
                    margin: "0 auto"
                }}
            >
                <div>
                    <KilometersChartGlow />
                </div>

                <div>
                    <SpeedChartGlow />
                </div>

                <div>
                    <CaloriesChartGlow />
                </div>

                <div>
                    <ElevationChartGlow />
                </div>
            </Carousel>

            <div style={{
                textAlign:"center",
                marginTop: "10px",
                color: "#8c8c8c",
                fontSize: "13px",
                fontStyle: "italic"
            }}>
                ← Desliza para ver más estadísticas →
            </div>
        </div>
    );
}