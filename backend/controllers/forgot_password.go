package controllers

import (
    "fmt"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "github.com/dgrijalva/jwt-go" // Untuk menghasilkan JWT
    "backend/models"
	"os"
)

// Secret key untuk JWT
var jwtSecrets = []byte(os.Getenv("JWT_SECRET"))

// ForgotPasswordController struct
type ForgotPasswordController struct {
    DB *gorm.DB
}

// NewForgotPasswordController creates a new instance of ForgotPasswordController
func NewForgotPasswordController(db *gorm.DB) *ForgotPasswordController {
    return &ForgotPasswordController{DB: db}
}

// ForgotPassword handles forgot password request
func (fpc *ForgotPasswordController) ForgotPassword(c *gin.Context) {
    // Parse request body
    var input struct {
        Email string `json:"email"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Validasi input
    if input.Email == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Email is required"})
        return
    }

    // Cari pengguna berdasarkan email
    var user models.User
    if err := fpc.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Email not found"})
        return
    }

    // Generate JWT token untuk reset password
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID,
        "exp":     time.Now().Add(time.Hour * 1).Unix(), // Token valid selama 1 jam
    })

    tokenString, err := token.SignedString(jwtSecrets)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    // Kirim email dengan token (gunakan layanan email seperti SMTP atau API email)
    resetLink := fmt.Sprintf("http://localhost:5173/reset-password?token=%s", tokenString)
    fmt.Printf("Reset password link: %s\n", resetLink) // Simulasi pengiriman email

    // Kirim respons sukses
    c.JSON(http.StatusOK, gin.H{"message": "Reset password link has been sent to your email"})
}