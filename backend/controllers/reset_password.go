package controllers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"
    "github.com/dgrijalva/jwt-go" // Untuk memverifikasi JWT
    "backend/models"
)

// Secret key untuk JWT
var jwtSecrett = []byte("your_jwt_secret_key")

// ResetPasswordController struct
type ResetPasswordController struct {
    DB *gorm.DB
}

// NewResetPasswordController creates a new instance of ResetPasswordController
func NewResetPasswordController(db *gorm.DB) *ResetPasswordController {
    return &ResetPasswordController{DB: db}
}

// ResetPassword handles reset password request
func (rpc *ResetPasswordController) ResetPassword(c *gin.Context) {
    // Parse request body
    var input struct {
        Token    string `json:"token"`
        Password string `json:"password"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Validasi input
    if input.Token == "" || input.Password == "" {
        c.JSON(http.StatusForbidden, gin.H{"error": "Token and password are required"})
        return
    }

    // Verifikasi token
    token, err := jwt.Parse(input.Token, func(token *jwt.Token) (interface{}, error) {
        return jwtSecrett, nil
    })

    if err != nil || !token.Valid {
        c.JSON(http.StatusForbidden, gin.H{"error": "Invalid or expired token"})
        return
    }

    // Ambil user ID dari token
    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok {
        c.JSON(http.StatusForbidden, gin.H{"error": "Invalid token claims"})
        return
    }

    userID := uint(claims["user_id"].(float64))

    // Cek apakah pengguna ada di database
    var user models.User
    if err := rpc.DB.Where("id = ?", userID).First(&user).Error; err != nil {
        c.JSON(http.StatusForbidden, gin.H{"error": "User not found"})
        return
    }

    // Hash password baru
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    // Update password di database
    if err := rpc.DB.Model(&models.User{}).Where("id = ?", userID).Update("password", string(hashedPassword)).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
        return
    }

    // Kirim respons sukses
    c.JSON(http.StatusOK, gin.H{"message": "Password has been reset successfully"})
}