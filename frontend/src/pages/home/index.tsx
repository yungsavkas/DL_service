import { motion } from "framer-motion";
import StyledLink from "../../shared/ui/StyledLink";
import { Button } from "@nextui-org/react";
import React from "react";

export default function Home() {
    return (
        <div style={{ position: "relative", overflow: "hidden", height: "calc(100vh - 65px)", padding: '20px', textAlign: 'center' }}>
            {/* Фон с градиентными шарами */}
            <div style={{
                position: "absolute",
                top: "-100px",
                left: "-100px",
                width: "400px",
                height: "400px",
                background: "radial-gradient(circle, rgba(95, 121, 255, 0.6), rgba(95, 121, 255, 0))",
                filter: "blur(150px)",
                zIndex: 0,
            }} />
            <div style={{
                position: "absolute",
                bottom: "-150px",
                right: "-150px",
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, rgba(123, 222, 254, 0.6), rgba(123, 222, 254, 0))",
                filter: "blur(150px)",
                zIndex: 0,
            }} />
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "600px",
                height: "600px",
                background: "radial-gradient(circle, rgba(138, 43, 226, 0.4), rgba(138, 43, 226, 0))",
                filter: "blur(200px)",
                zIndex: 0,
            }} />

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", position: "relative", zIndex: 1 }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    style={{
                        background: "linear-gradient(17deg, rgb(68 99 255) -20%, rgb(121 207 255) 100%) text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        textAlign: "center",
                        fontSize: "60px",
                        fontWeight: "bold",
                        marginTop: '100px'  // Смещаем заголовок ближе к хедеру
                    }}
                >
                    Video Ad Moderator
                </motion.h1>

                {/* Описание сервиса с анимацией */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                    style={{
                        fontSize: "20px",
                        marginTop: "20px",
                        maxWidth: "800px",
                        lineHeight: "1.5",
                    }}
                >
                    Video Ad Moderator is a powerful tool for automatically reviewing ad videos. Thanks to precise algorithms and deep content analysis, you can save time and avoid rejections when publishing ads.
                </motion.p>

                {/* Заключительный призыв к действию с анимацией */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    style={{
                        fontSize: "22px",
                        marginTop: "40px",
                        fontWeight: "500",
                    }}
                >
                    Pass moderation the first time with Video Ad Moderator!
                </motion.p>

                {/* Анимированная кнопка */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    style={{ marginTop: '20px' }}
                >
                    <Button as={StyledLink} color="primary" to="/analyze" size={'lg'} variant="shadow">
                        Analyze
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
