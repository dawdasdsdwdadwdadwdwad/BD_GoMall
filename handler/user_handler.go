// handler 包负责处理HTTP请求
package handler

// 导入所需的包
import (
	// context包用于处理上下文
	"context"
	// strconv包用于字符串和数字之间的转换
	"strconv"
	// 导入自定义的model包
	"translate/admin/middleware"
	"translate/admin/model"

	// hertz框架的app包，提供HTTP请求处理功能
	"github.com/cloudwego/hertz/pkg/app"
	"golang.org/x/crypto/bcrypt"
)

// LoginRequest 登录请求结构
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// UserHandler 结构体定义，包含用户相关的处理方法
// userService 字段用于处理用户相关的业务逻辑
type UserHandler struct {
	userService model.UserService
}

// NewUserHandler 创建一个新的UserHandler实例
// 参数 userService: 用户服务接口的实现
// 返回: UserHandler实例的指针
func NewUserHandler(userService model.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

// Register 处理用户注册请求
// 参数 ctx: 上下文信息
// 参数 c: HTTP请求上下文
func (h *UserHandler) Register(ctx context.Context, c *app.RequestContext) {
	// 声明一个User结构体变量用于存储用户数据
	var user model.User
	// 将请求体中的JSON数据解析到user结构体中
	if err := c.BindJSON(&user); err != nil {
		// 如果解析失败，返回400错误
		c.JSON(400, map[string]interface{}{
			"code": 400,
			"msg":  "无效的请求参数",
		})
		return
	}

	// 对密码进行加密
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, map[string]interface{}{
			"code": 500,
			"msg":  "密码加密失败",
		})
		return
	}
	user.Password = string(hashedPassword)

	token, err := middleware.GenerateToken(&user)
	if err != nil {
		c.JSON(500, map[string]interface{}{
			"code": 500,
			"msg":  "生成token失败",
		})
		return
	}
	// 调用userService的Create方法创建新用户
	if err := h.userService.Create(&user); err != nil {
		// 如果创建失败，返回500错误
		c.JSON(500, map[string]interface{}{
			"code": 500,
			"msg":  "注册失败: " + err.Error(),
		})
		return
	}

	// 注册成功，返回200状态码和用户数据
	c.JSON(200, map[string]interface{}{
		"code": 200,
		"msg":  "注册成功",
		"data": map[string]interface{}{
			"token": token,
			"user":  user,
		},
	})
}

// GetUserList 获取用户列表
// 参数 ctx: 上下文信息
// 参数 c: HTTP请求上下文
func (h *UserHandler) GetUserList(ctx context.Context, c *app.RequestContext) {
	// 从查询参数中获取页码和每页数量
	page, _ := strconv.Atoi(c.Query("page"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))

	// 调用userService的List方法获取用户列表和总数
	users, total, err := h.userService.List(page, pageSize)
	if err != nil {
		// 如果获取失败，返回500错误
		c.JSON(500, map[string]interface{}{
			"code": 500,
			"msg":  "获取用户列表失败: " + err.Error(),
		})
		return
	}

	// 获取成功，返回用户列表数据和总数
	c.JSON(200, map[string]interface{}{
		"code":  200,
		"msg":   "获取成功",
		"data":  users,
		"total": total,
	})
}

// GetUserByID 根据用户ID获取用户信息
// 参数 ctx: 上下文信息
// 参数 c: HTTP请求上下文
func (h *UserHandler) GetUserByID(ctx context.Context, c *app.RequestContext) {
	// 从URL参数中获取用户ID并转换为uint类型
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		// 如果ID无效，返回400错误
		c.JSON(400, map[string]interface{}{
			"code": 400,
			"msg":  "无效的用户ID",
		})
		return
	}

	// 调用userService的GetByID方法获取用户信息
	user, err := h.userService.GetByID(uint(id))
	if err != nil {
		// 如果获取失败，返回500错误
		c.JSON(500, map[string]interface{}{
			"code": 500,
			"msg":  "获取用户信息失败: " + err.Error(),
		})
		return
	}

	// 获取成功，返回用户信息
	c.JSON(200, map[string]interface{}{
		"code": 200,
		"msg":  "获取成功",
		"data": user,
	})
}

// UpdateUser 更新用户信息
// 参数 ctx: 上下文信息
// 参数 c: HTTP请求上下文
func (h *UserHandler) UpdateUser(ctx context.Context, c *app.RequestContext) {
	// 从URL参数中获取用户ID
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		// 如果ID无效，返回400错误
		c.JSON(400, map[string]interface{}{
			"code": 400,
			"msg":  "无效的用户ID",
		})
		return
	}

	// 从上下文中获取当前用户的角色和ID
	userRole, _ := c.Get("role")
	currentUserID, _ := c.Get("user_id")

	// 验证用户权限：只有管理员或用户本人可以修改信息
	if userRole.(string) != "admin" && currentUserID.(uint) != uint(id) {
		// 权限不足，返回403错误
		c.JSON(403, map[string]interface{}{
			"code": 403,
			"msg":  "权限不足",
		})
		return
	}

	// 声明User结构体变量用于存储更新数据
	var user model.User
	// 解析请求体中的JSON数据
	if err := c.BindJSON(&user); err != nil {
		// 如果解析失败，返回400错误
		c.JSON(400, map[string]interface{}{
			"code": 400,
			"msg":  "无效的请求参数",
		})
		return
	}

	// 设置用户ID
	user.ID = uint(id)
	// 调用userService的Update方法更新用户信息
	if err := h.userService.Update(&user); err != nil {
		// 如果更新失败，返回500错误
		c.JSON(500, map[string]interface{}{
			"code": 500,
			"msg":  "更新失败: " + err.Error(),
		})
		return
	}

	// 更新成功，返回更新后的用户信息
	c.JSON(200, map[string]interface{}{
		"code": 200,
		"msg":  "更新成功",
		"data": user,
	})
}

// DeleteUser 删除用户
// 参数 ctx: 上下文信息
// 参数 c: HTTP请求上下文
func (h *UserHandler) DeleteUser(ctx context.Context, c *app.RequestContext) {
	// 从URL参数中获取要删除的用户ID
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		// 如果ID无效，返回400错误
		c.JSON(400, map[string]interface{}{
			"code": 400,
			"msg":  "无效的用户ID",
		})
		return
	}

	// 调用userService的Delete方法删除用户
	if err := h.userService.Delete(uint(id)); err != nil {
		// 如果删除失败，返回500错误
		c.JSON(500, map[string]interface{}{
			"code": 500,
			"msg":  "删除失败: " + err.Error(),
		})
		return
	}

	// 删除成功，返回成功消息
	c.JSON(200, map[string]interface{}{
		"code": 200,
		"msg":  "删除成功",
	})
}

// Login 用户登录
// 参数 ctx: 上下文信息
// 参数 c: HTTP请求上下文
func (h *UserHandler) Login(ctx context.Context, c *app.RequestContext) {
	var req LoginRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(400, map[string]interface{}{
			"code": 400,
			"msg":  "无效的请求参数",
		})
		return
	}

	// 获取用户信息
	user, err := h.userService.GetByUsername(req.Username)
	if err != nil {
		c.JSON(401, map[string]interface{}{
			"code": 401,
			"msg":  "无此用户",
		})
		return
	}

	// 验证密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {

		c.JSON(401, map[string]interface{}{
			"code": 401,
			"msg":  "密码错误",
		})
		return
	}

	// 生成Token
	token, err := middleware.GenerateToken(user)
	if err != nil {
		c.JSON(500, map[string]interface{}{
			"code": 500,
			"msg":  "生成token失败",
		})
		return
	}

	c.JSON(200, map[string]interface{}{
		"code": 200,
		"msg":  "登录成功",
		"data": map[string]interface{}{
			"token": token,
			"user":  user,
		},
	})
}
