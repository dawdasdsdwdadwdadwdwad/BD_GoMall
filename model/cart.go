package model

import "time"

type CartItem struct {
	UserID    uint      `json:"user_id" gorm:"not null"`
	ProductID uint      `json:"product_id" gorm:"not null"`
	Quantity  int       `json:"quantity" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (CartItem) TableName() string {
	return "cart_items"
}

type CartService interface {
	AddToCart(userID uint, item *CartItem) error
	GetCart(userID uint) ([]*CartItem, error)
	ClearCart(userID uint) error
	UpdateCartItemQuantity(userID uint, productID uint, quantity int) error
	RemoveFromCart(userID uint, productID uint) error
}
