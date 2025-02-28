package model

import "time"

// 类似schema const userSchema= new Schema{username:{type:String,unique:true}}
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Password  string    `json:"password,omitempty" gorm:"not null"`
	Nickname  string    `json:"nickname"`
	Email     string    `json:"email"`
	Role      string    `json:"role" gorm:"default:'user'"`
	Status    int       `json:"status" gorm:"default:1"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName 指定表名
func (User) TableName() string {
	return "users"
}

// UserService 用户服务接口
type UserService interface {
	Create(user *User) error
	Update(user *User) error
	Delete(id uint) error
	GetByID(id uint) (*User, error)
	GetByUsername(username string) (*User, error)
	List(page, pageSize int) ([]*User, int64, error)
}
