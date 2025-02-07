package controllers

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
    "backend/models"
    "gorm.io/gorm"
)

type AuthController struct {
    DB *gorm.DB
}

func NewAuthController(db *gorm.DB) *AuthController {
    return &AuthController{DB: db}
}

func (ac *AuthController) Signup(c *gin.Context) {
    // Parse request body
    var input struct {
        Username string `json:"username"`
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Validasi input
    if strings.TrimSpace(input.Username) == "" || strings.TrimSpace(input.Email) == "" || strings.TrimSpace(input.Password) == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
        return
    }

    // Cek apakah email sudah terdaftar
    var existingUser models.User
    if err := ac.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
        return
    }

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
        return
    }

    // Simpan pengguna ke database
    newUser := models.User{
        Username: input.Username,
        Email:    input.Email,
        Password: string(hashedPassword),
    }

    if err := ac.DB.Create(&newUser).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
        return
    }

    // Kirim respons
    c.JSON(http.StatusCreated, gin.H{"message": "Sign Up successful!"})
}