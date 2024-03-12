const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken'); // JWT를 사용하기 위해 추가
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
const KAKA_SECRET_KEY = process.env.KAKAO_SECRET;
const User = require('../models/user');

const axios = require('axios');

router.post('/auth/kakao/login', async (req, res) => {
   const code = req.body.code;

   try {
      // 카카오로부터 액세스 토큰 받기
      const response = await axios.post(
         'https://kauth.kakao.com/oauth/token',
         {
            grant_type: 'authorization_code',
            client_id: KAKAO_CLIENT_ID,
            redirect_uri: KAKAO_REDIRECT_URI,
            code,
         },
         {
            headers: {
               'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
         },
      );

      const { access_token, refresh_token } = response.data;

      if (response.status === 200) {
         const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
               Authorization: `Bearer ${access_token}`,
            },
         });

         const userData = userResponse.data;
         const nickname = userData.properties.nickname;
         const email = userData.kakao_account.email;

         // 이메일로 사용자 찾기
         let user = await User.findOne({ where: { email } });

         if (!user) {
            // 사용자가 없으면 회원가입 진행
            user = await User.create({ email, nickname });
            console.log('회원가입 성공');
         } else {
            // 이미 존재하는 사용자이면 로그인 처리
            console.log('로그인 성공');
         }

         console.log(user);
         // 사용자 인증 토큰 발급
         const token = jwt.sign({ userId: user.id }, KAKA_SECRET_KEY, { expiresIn: '1h' });

         // 발급한 토큰을 클라이언트에게 전달
         res.json({
            user,
            token,
         });
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   }
});

module.exports = router;
