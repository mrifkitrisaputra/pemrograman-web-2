package models

import (
    "gorm.io/gorm"
)

// User represents the user model
type User struct {
    gorm.Model
    Username string `json:"username" gorm:"unique;not null"`
    Email    string `json:"email" gorm:"unique;not null"`
    Password string `json:"-" gorm:"not null"` // Password tidak dikembalikan dalam respons JSON
    Name     string `json:"name" gorm:"not null"` // Tambahkan field Name
}