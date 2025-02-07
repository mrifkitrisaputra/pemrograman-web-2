package controllers

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
    "backend/models"
    "gorm.io/gorm"
)

// SignupController struct
type SignupController struct {
    DB *gorm.DB
}

// NewSignupController creates a new instance of SignupController
func NewSignupController(db *gorm.DB) *SignupController {
    return &SignupController{DB: db}
}

// Signup handles user registration
func (sc *SignupController) Signup(c *gin.Context) {
    // Parse request body
    var input struct {
        Username string `json:"username"`
        Email    string `json:"email"`
        Password string `json:"password"`
        Name     string `json:"name"`
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
    if err := sc.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
        return
    }

    // Cek apakah username sudah terdaftar
    if err := sc.DB.Where("username = ?", input.Username).First(&existingUser).Error; err == nil {
        c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
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
        Name:     input.Name,
    }

    if err := sc.DB.Create(&newUser).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
        return
    }

    // Kirim respons sukses
    c.JSON(http.StatusCreated, gin.H{"message": "Sign Up successful!"})
}