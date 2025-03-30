import fs from 'fs';
import path from 'path';

const users = [
  { name: "김인성", handle: "danto7632" },
    { name: "이연호", handle: "yeonho2010" },
    { name: "김성민", handle: "kksm0403" },
    { name: "박세린", handle: "tpfls" },
    { name: "조혜인", handle: "chi031114" },
    { name: "이세연", handle: "tpdus3151" },
    { name: "신동수", handle: "tlsehdtn12" },
    { name: "이나연", handle: "leenayeon0915" },
    { name: "김준혁", handle: "ddo0122" },
    { name: "변가은", handle: "qusrkdms3" },
    { name: "황채린", handle: "hchrin" }
];

const proxy = 'https://solvedac-profile-theta.vercel.app/api/proxy?url=';

// ✅ 재시도 함수
async function fetchWithRetry(url, attempts = 3, delay = 3000) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`⚠️ (${i + 1}/${attempts}) 실패: ${err.message}`);
      if (i < attempts - 1) {
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw new Error(`❌ ${url} 요청 실패 (재시도 모두 실패)`);
}

export default async function handler(req, res) {
  const profiles = [];

  for (const user of users) {
    const url = proxy + encodeURIComponent(`https://solved.ac/api/v3/user/show?handle=${user.handle}`);

    try {
      const data = await fetchWithRetry(url);

      profiles.push({
        name: user.name,
        handle: user.handle,
        tier: data.tier,
        rating: data.rating,
        maxStreak: data.maxStreak
      });

    } catch (err) {
      console.error(`❌ ${user.handle} 데이터 가져오기 실패:`, err.message);
    }
  }

  // 점수 내림차순 정렬
  profiles.sort((a, b) => b.rating - a.rating);

  // 저장 경로
  const filePath = path.resolve('./data/profiles.json');
  fs.writeFileSync(filePath, JSON.stringify(profiles, null, 2), 'utf-8');

  return res.status(200).send('✅ 프로필 데이터 업데이트 완료');
}




