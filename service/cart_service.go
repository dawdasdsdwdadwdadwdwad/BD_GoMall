package service

import (
	"translate/admin/model"

	"gorm.io/gorm"
)

// CartServiceImpl 购物车服务实现
type CartServiceImpl struct {
	db *gorm.DB
}

// NewCartService 创建购物车服务实例
func NewCartService(db *gorm.DB) model.CartService {
	return &CartServiceImpl{db: db}
}

// AddToCart 添加商品到购物车
func (s *CartServiceImpl) AddToCart(userID uint, item *model.CartItem) error {
	// 设置用户ID
	item.UserID = userID

	// 查找是否已存在相同商品
	var existingItem model.CartItem
	result := s.db.Where("user_id = ? AND product_id = ?", userID, item.ProductID).First(&existingItem)

	if result.Error == nil {
		// 如果商品已存在，更新数量
		existingItem.Quantity += item.Quantity
		return s.db.Save(&existingItem).Error
	}

	// 如果商品不存在，创建新记录
	return s.db.Create(item).Error
}

// GetCart 获取用户的购物车列表
func (s *CartServiceImpl) GetCart(userID uint) ([]*model.CartItem, error) {
	var items []*model.CartItem
	err := s.db.Where("user_id = ?", userID).Find(&items).Error
	return items, err
}

// ClearCart 清空用户的购物车
func (s *CartServiceImpl) ClearCart(userID uint) error {
	return s.db.Where("user_id = ?", userID).Delete(&model.CartItem{}).Error
}

// UpdateCartItemQuantity 更新购物车商品数量
func (s *CartServiceImpl) UpdateCartItemQuantity(userID uint, productID uint, quantity int) error {
	result := s.db.Model(&model.CartItem{}).Where("user_id = ? AND product_id = ?", userID, productID).Update("quantity", quantity)
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}

// RemoveFromCart 从购物车中删除商品
func (s *CartServiceImpl) RemoveFromCart(userID uint, productID uint) error {
	result := s.db.Where("user_id = ? AND product_id = ?", userID, productID).Delete(&model.CartItem{})
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}
