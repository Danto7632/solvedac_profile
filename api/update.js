export default async function handler(req, res) {
  const users = [
    { name: '김인성', handle: 'danto7632' },
    { name: '이연호', handle: 'yeonho2010' },
    { name: '김성민', handle: 'kksm0403' },
    { name: '박세린', handle: 'tpfls' },
    { name: '조혜인', handle: 'chi031114' },
    { name: '이세연', handle: 'tpdus3151' },
    { name: '신동수', handle: 'tlsehdtn12' },
    { name: '이나연', handle: 'leenayeon0915' },
    { name: '김준혁', handle: 'ddo0122' },
    { name: '변가은', handle: 'qusrkdms3' },
    { name: '황채린', handle: 'hchrin' }
  ];

  const profiles = [];

  for (const user of users) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const url = `https://solved.ac/api/v3/user/show?handle=${encodeURIComponent(user.handle)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'solvedac-profile/1.0'
        },
        signal: controller.signal
      });

      const text = await response.text();

      if (!response.ok) {
        console.error(
          `[update] ${user.handle} 요청 실패 - status: ${response.status}, body: ${text.slice(0, 200)}`
        );
        continue;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error(
          `[update] ${user.handle} JSON 파싱 실패: ${parseError.message}, body: ${text.slice(0, 200)}`
        );
        continue;
      }

      profiles.push({
        name: user.name,
        handle: user.handle,
        tier: data.tier ?? 0,
        rating: data.rating ?? 0,
        maxStreak: data.maxStreak ?? 0,
        class: data.class ?? 0,
        classDecoration: data.classDecoration ?? 'none'
      });
    } catch (error) {
      console.error(`[update] ${user.handle} 처리 중 에러: ${error.message}`);
    } finally {
      clearTimeout(timeout);
    }
  }

  profiles.sort((a, b) => b.rating - a.rating);

  if (profiles.length === 0) {
    return res.status(502).json({
      message: '모든 solved.ac 프로필 수집에 실패했습니다.'
    });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(profiles);
}
