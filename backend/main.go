package main

import (
    "database/sql"
    "fmt"
    "github.com/gin-gonic/gin"
    _ "github.com/go-sql-driver/mysql"
    "net/http"
)

var db *sql.DB

func initDB() {
    var err error
    dsn := "root:mybackend@tcp(127.0.0.1:3306)/backend" // Ganti dengan konfigurasi Anda
    db, err = sql.Open("mysql", dsn)
    if err != nil {
        panic(err)
    }

    err = db.Ping()
    if err != nil {
        panic(err)
    }

    fmt.Println("Connected to the database")
}

func main() {
    // Inisialisasi database
    initDB()

    // Set mode Gin ke release (opsional)
    gin.SetMode(gin.ReleaseMode)

    // Inisialisasi router Gin
    router := gin.Default()

    // Middleware untuk mengizinkan CORS
    router.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(http.StatusOK)
            return
        }
        c.Next()
    })

    // Endpoint GET untuk mendapatkan semua pengguna
    router.GET("/api/users", func(c *gin.Context) {
        rows, err := db.Query("SELECT id, name, email FROM users")
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        defer rows.Close()

        var users []map[string]interface{}
        for rows.Next() {
            var id int
            var name, email string
            err := rows.Scan(&id, &name, &email)
            if err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
            users = append(users, map[string]interface{}{
                "id":    id,
                "name":  name,
                "email": email,
            })
        }

        c.JSON(http.StatusOK, users)
    })

    // Jalankan server pada port 8080
    router.Run(":8080")
}