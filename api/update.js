export default async function handler(req, res) {
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
    { name: "변가은", handle: "qusrkdms3" }
  ];

  const proxy = 'https://solvedac-profile-theta.vercel.app/api/proxy?url=';
  const profiles = [];

  for (const user of users) {
    try {
      const url = proxy + encodeURIComponent(`https://solved.ac/api/v3/user/show?handle=${user.handle}`);
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`${user.handle} 요청 실패`);
        continue;
      }

      const data = await response.json();

      profiles.push({
        name: user.name,
        handle: user.handle,
        tier: data.tier,
        rating: data.rating,
        maxStreak: data.maxStreak
      });

    } catch (e) {
      console.error(`${user.handle} 처리 중 에러:`, e);
    }
  }

  profiles.sort((a, b) => b.rating - a.rating);

  res.status(200).json(profiles);
}
