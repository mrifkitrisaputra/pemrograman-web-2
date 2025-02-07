package main

import (
	"fmt"
	"log"
	"time"

	"backend/controllers"
	"backend/models"

	"github.com/gin-contrib/cors" // Import middleware CORS
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
    // Konfigurasi koneksi database
    dsn := "root:mybackend@tcp(127.0.0.1:3307)/backend?charset=utf8mb4&parseTime=True&loc=Local"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("Database connection error: %v", err)
    }

    // Auto migrate model User
    db.AutoMigrate(&models.User{})

    // Inisialisasi Gin
    r := gin.Default()

    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"}, // Izinkan frontend di port 3000
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour, // Cache preflight request selama 12 jam
    }))

    // Rute API
    authController := controllers.NewAuthController(db)
    r.POST("/api/signup", authController.Signup)

    // Jalankan server
    fmt.Println("Server running on port 8080")
    r.Run(":8080")
}