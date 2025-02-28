package service

import (
	"errors"
	"translate/admin/model"
	"gorm.io/gorm"
)

// UserServiceImpl 用户服务实现
type UserServiceImpl struct {
	db *gorm.DB
}

// NewUserService 创建用户服务实例
func NewUserService(db *gorm.DB) model.UserService {
	return &UserServiceImpl{db: db}
}

// Create 创建用户
func (s *UserServiceImpl) Create(user *model.User) error {
	if user == nil {
		return errors.New("用户信息不能为空")
	}
	return s.db.Create(user).Error
}

// Update 更新用户信息
func (s *UserServiceImpl) Update(user *model.User) error {
	if user == nil || user.ID == 0 {
		return errors.New("无效的用户信息")
	}
	return s.db.Model(user).Updates(user).Error
}

// Delete 删除用户
func (s *UserServiceImpl) Delete(id uint) error {
	if id == 0 {
		return errors.New("无效的用户ID")
	}
	return s.db.Delete(&model.User{}, id).Error
}

// GetByID 根据ID获取用户
func (s *UserServiceImpl) GetByID(id uint) (*model.User, error) {
	if id == 0 {
		return nil, errors.New("无效的用户ID")
	}
	var user model.User
	err := s.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// GetByUsername 根据用户名获取用户
func (s *UserServiceImpl) GetByUsername(username string) (*model.User, error) {
	if username == "" {
		return nil, errors.New("用户名不能为空")
	}
	var user model.User
	err := s.db.Where("username = ?", username).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// List 获取用户列表
func (s *UserServiceImpl) List(page, pageSize int) ([]*model.User, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	var total int64
	var users []*model.User

	// 获取总数
	if err := s.db.Model(&model.User{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 获取分页数据
	offset := (page - 1) * pageSize
	if err := s.db.Offset(offset).Limit(pageSize).Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}