import AuthService from '../../services/auth/AuthService.js';
import UserService from '../../services/users/UserService.js';
import express from 'express';

const router = express.Router();
const userService = new UserService();
const authService = new AuthService();

/**
 * サインイン
 */
router.post('/signin', async (req, res, next) => {
  try {
    // リクエストパラメーター
    const { email, password } = req.body;

    // ユーザー存在チェックを行う
    const resSearchUser = await userService.searchUser('', '', email, password);

    // パラメータ存在しない場合は再ログインを促すため、空で返却する
    if (!resSearchUser.length) return res.status(200).json({});

    // トークンを発行する
    const resCreateToken = await authService.createToken(email);

    // 返却用データを生成
    const body = {
      email: email,
      token: resCreateToken,
    };

    res.status(200).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

export default router;
