package controllers

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
    "backend/models"
    "gorm.io/gorm"
    "github.com/dgrijalva/jwt-go"
    "os" // Untuk membaca variabel lingkungan
)

// Secret key untuk JWT
var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// LoginController struct
type LoginController struct {
    DB *gorm.DB
}

// NewLoginController creates a new instance of LoginController
func NewLoginController(db *gorm.DB) *LoginController {
    return &LoginController{DB: db}
}

// Login handles user authentication
func (lc *LoginController) Login(c *gin.Context) {
    // Parse request body
    var input struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    // Validasi input
    if input.Username == "" || input.Password == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Username and password are required"})
        return
    }

    // Cari pengguna berdasarkan username
    var user models.User
    if err := lc.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
        return
    }

    // Verifikasi password
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
        return
    }

    // Generate JWT token
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID,
        "exp":     time.Now().Add(time.Hour * 24).Unix(), // Token valid selama 24 jam
    })

    tokenString, err := token.SignedString(jwtSecret)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
        return
    }

    // Kirim respons sukses dengan token
    c.JSON(http.StatusOK, gin.H{"message": "Login successful", "token": tokenString})
}