package main

import (
    "fmt"
    "log"
    "os"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "github.com/joho/godotenv"
    "backend/controllers"
    "backend/models"
)

func main() {
    // Load .env file
    if err := godotenv.Load(); err != nil {
        log.Fatal("Error loading .env file")
    }

    // Baca variabel dari .env
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbName := os.Getenv("DB_NAME")

    // Konfigurasi koneksi database
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPassword, dbHost, dbPort, dbName)
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("Database connection error: %v", err)
    }

    // Auto migrate model User
    if err := db.AutoMigrate(&models.User{}); err != nil {
        log.Fatalf("Failed to migrate database: %v", err)
    }

    // Inisialisasi Gin
    r := gin.Default()

    // Middleware CORS
    allowedOrigins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
    r.Use(cors.New(cors.Config{
        AllowOrigins:     allowedOrigins,
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))

    // Debugging: Tampilkan rute yang tersedia
    routes := r.Routes()
    fmt.Println("Available Routes:")
    for _, route := range routes {
        fmt.Printf("- %s %s\n", route.Method, route.Path)
    }

    // Inisialisasi controller
    signupController := controllers.NewSignupController(db)
    loginController := controllers.NewLoginController(db)
    forgotPasswordController := controllers.NewForgotPasswordController(db)
    resetPasswordController := controllers.NewResetPasswordController(db)

    // Rute API
    r.POST("/api/signup", signupController.Signup)
    r.POST("/api/login", loginController.Login)
    r.POST("/api/forgot-password", forgotPasswordController.ForgotPassword)
    r.POST("/api/reset-password", resetPasswordController.ResetPassword)

    // Jalankan server
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080" // Default port jika tidak ada di .env
    }
    fmt.Printf("Server running on port %s\n", port)
    if err := r.Run(":" + port); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}