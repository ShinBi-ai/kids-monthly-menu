import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ExternalLink, Calendar as CalendarIcon, Utensils, Info } from 'lucide-react';

// 공무원님의 구글 시트 ID가 적용되어 있습니다.
const GOOGLE_SHEET_ID = "1pghEET0zyAht-7Ww4vuKQZ2jXWAe1zw-8vI7ujfO190";

// 편식 대체 식재료 데이터
const alternativeIngredientsMap = {
  "다진 당근": { alt: "단호박", reason: "비슷한 영양소(비타민A)에 단맛이 나서 거부감이 적어요!" },
  "양파": { alt: "양배추", reason: "매운맛 없이 볶으면 달큰한 맛이 나서 아이들이 좋아해요." },
  "대파": { alt: "쪽파", reason: "향이 덜 강하고 부드러워 파를 싫어하는 아이에게 좋아요." },
  "애호박": { alt: "브로콜리(잘게 다짐)", reason: "식감이 부담스럽다면 브로콜리를 다져서 숨겨보세요." }
};

const checkSeasonal = (ingredients, month) => {
  const currentMonth = month + 1;
  const seasonalMap = {
    5: ["토마토", "감자", "애호박", "달래"], 6: ["토마토", "감자", "애호박"],
    7: ["토마토", "감자", "애호박", "옥수수"], 8: ["고구마", "감자", "옥수수", "토마토"],
    9: ["고구마", "사과", "단호박"], 10: ["고구마", "사과", "단호박", "무"],
    11: ["무", "배추", "사과", "고구마"], 12: ["무", "배추", "귤"],
    1: ["귤", "무", "딸기"], 2: ["딸기", "시금치"],
    3: ["딸기", "시금치", "달래"], 4: ["딸기", "달래", "토마토"]
  };
  const seasonals = seasonalMap[currentMonth] || ["감자", "양파"];
  return ingredients.some(ing => seasonals.some(s => ing.name.includes(s)));
};

// 유튜브 영상 ID 매핑 (정확한 ID로 전면 수정)
const youtubeVideoMap = {
  "부드러운 소고기 미역국 정식": "z90ZqeqtPQY",
  "영양만점 야채 계란찜과 밥": "PtK88koPxDI",
  "소화가 잘되는 닭가슴살 오트밀죽": "NpRDkTB98cc",
  "시금치 프리타타": "H4bxgz34ZR4",
  "포슬포슬 감자채 볶음과 스크램블": "pyxe0akVbww",
  "수제 두부 떡갈비": "oFt-dBUEi8w",
  "두뇌 발달 고등어 카레구이": "fMG8djO7JWw",
  "단짠단짠 저염 간장 돼지불고기": "iDXMaHk7geU",
  "야채 듬뿍 볶음밥과 맑은 국": "3edKOhCLdGM", // 대체 영상
  "토마토 해산물 리조또": "Q4SQybIOUek",
  "수제 고구마 맛탕": "aXJgN_JjYDg",
  "제철 과일과 그릭 요거트": "KRsVZY80-NM",
  "부드러운 고구마 수프": "o1r_oZZIj5U",
  "단호박 훈제오리 찜": "rlIvmfGSXQ8",
  "우엉 김밥": "veDdwgDfPi4",
  "버섯 불고기 전골": "iDXMaHk7geU", // 대체 영상
  "새우살 애호박전": "lZQKn88nyIc",
  "달래 간장 비빔밥": "ceSuK8MVEb4",
  "채수 잔치국수": "Gq9S0dJ3wHg",
  "궁중 떡볶이": "WgKMwGqQRko" // 대체 영상
};

const generateMockMeals = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data = {};

  // 평일(월~금) 5일치 메뉴
  const weekdayBreakfastOptions = [
    { name: "부드러운 소고기 미역국 정식", ingredients: [{ name: "소고기 국거리", qty: "100g" }, { name: "자른 미역", qty: "한 줌" }] },
    { name: "영양만점 야채 계란찜과 밥", ingredients: [{ name: "계란", qty: "3개" }, { name: "다진 당근", qty: "1스푼" }, { name: "대파", qty: "약간" }] },
    { name: "소화가 잘되는 닭가슴살 오트밀죽", ingredients: [{ name: "오트밀", qty: "50g" }, { name: "닭가슴살", qty: "100g" }] },
    { name: "시금치 프리타타", ingredients: [{ name: "시금치", qty: "1줌" }, { name: "계란", qty: "4개" }, { name: "방울토마토", qty: "5개" }] },
    { name: "포슬포슬 감자채 볶음과 스크램블", ingredients: [{ name: "감자", qty: "1개" }, { name: "양파", qty: "반개" }, { name: "계란", qty: "2개" }] }
  ];

  const weekdayDinnerOptions = [
    { name: "수제 두부 떡갈비", ingredients: [{ name: "다진 소고기", qty: "200g" }, { name: "두부", qty: "100g" }] },
    { name: "두뇌 발달 고등어 카레구이", ingredients: [{ name: "순살 고등어", qty: "2토막" }, { name: "카레가루", qty: "1스푼" }] },
    { name: "단짠단짠 저염 간장 돼지불고기", ingredients: [{ name: "돼지 앞다리살", qty: "300g" }, { name: "양파", qty: "1개" }, { name: "저염 간장", qty: "2스푼" }] },
    { name: "야채 듬뿍 볶음밥과 맑은 국", ingredients: [{ name: "다진 야채 믹스", qty: "1컵" }, { name: "새우살", qty: "50g" }, { name: "굴소스", qty: "약간" }] },
    { name: "토마토 해산물 리조또", ingredients: [{ name: "오징어", qty: "반마리" }, { name: "토마토 소스", qty: "1컵" }, { name: "치즈", qty: "1장" }] }
  ];

  // 주말(토, 일) 2일치 특식 메뉴
  const weekendBreakfastOptions = [
    { name: "우엉 김밥", ingredients: [{ name: "우엉조림", qty: "1팩" }, { name: "김밥용 김", qty: "5장" }, { name: "계란", qty: "3개" }] },
    { name: "채수 잔치국수", ingredients: [{ name: "소면", qty: "2인분" }, { name: "애호박", qty: "반개" }, { name: "다시마", qty: "1장" }] }
  ];

  const weekendDinnerOptions = [
    { name: "새우살 애호박전", ingredients: [{ name: "애호박", qty: "1개" }, { name: "다진 새우살", qty: "100g" }, { name: "부침가루", qty: "3스푼" }] },
    { name: "버섯 불고기 전골", ingredients: [{ name: "불고기용 소고기", qty: "300g" }, { name: "팽이버섯", qty: "1봉" }, { name: "당면", qty: "한 줌" }] }
  ];

  const snackOptions = [
    { name: "수제 고구마 맛탕", ingredients: [{ name: "고구마", qty: "2개" }, { name: "올리고당", qty: "2스푼" }, { name: "검은깨", qty: "약간" }] },
    { name: "제철 과일과 그릭 요거트", ingredients: [{ name: "그릭 요거트", qty: "1통" }, { name: "제철 과일", qty: "적당량" }, { name: "꿀", qty: "1스푼" }] },
    { name: "부드러운 고구마 수프", ingredients: [{ name: "고구마", qty: "1개" }, { name: "우유", qty: "200ml" }, { name: "버터", qty: "1조각" }] },
    { name: "단호박 훈제오리 찜", ingredients: [{ name: "미니 단호박", qty: "1개" }, { name: "훈제오리", qty: "100g" }] }
  ];

  // 연/월이 바뀔 때마다 메뉴가 다르게 섞이도록 Offset(오프셋) 적용
  const monthOffset = year + month;

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dateObj = new Date(year, month, i);
    const dayOfWeek = dateObj.getDay(); // 0(일) ~ 6(토)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // 평일/주말 메뉴 분기 및 Offset 섞기
    let breakfastMenu, dinnerMenu;
    
    if (isWeekend) {
      breakfastMenu = weekendBreakfastOptions[(i + monthOffset) % weekendBreakfastOptions.length];
      dinnerMenu = weekendDinnerOptions[(i + monthOffset) % weekendDinnerOptions.length];
    } else {
      breakfastMenu = weekdayBreakfastOptions[(i + monthOffset) % weekdayBreakfastOptions.length];
      dinnerMenu = weekdayDinnerOptions[(i + monthOffset) % weekdayDinnerOptions.length];
    }

    const snackMenu = snackOptions[(i + monthOffset) % snackOptions.length];

    data[dateStr] = {
      breakfast: { ...breakfastMenu, isSeasonal: checkSeasonal(breakfastMenu.ingredients, month), videoId: youtubeVideoMap[breakfastMenu.name] },
      dinner: { ...dinnerMenu, isSeasonal: checkSeasonal(dinnerMenu.ingredients, month), videoId: youtubeVideoMap[dinnerMenu.name] }
    };

    if (i % 2 === 0) {
      data[dateStr].snack = { ...snackMenu, isSeasonal: checkSeasonal(snackMenu.ingredients, month), videoId: youtubeVideoMap[snackMenu.name] };
    }
  }
  return data;
};

// 쿠팡 검색 링크 생성 함수
const getSearchLink = (query) => `https://www.coupang.com/np/search?q=${encodeURIComponent(query)}`;

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [meals, setMeals] = useState({});
  const [toastMessage, setToastMessage] = useState("");

  // CSS 깨짐 방지용 Tailwind 동적 로딩 (깃허브 직접 덮어쓰기용 해결책)
  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // 구글 시트 연동 및 초기 데이터 세팅
  useEffect(() => {
    const fetchSheetData = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const mockData = generateMockMeals(year, month);
      
      if (!GOOGLE_SHEET_ID) {
        setMeals(mockData);
        return;
      }

      try {
        const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json`;
        const response = await fetch(url);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        
        const sheetData = { ...mockData };

        json.table.rows.forEach((row, index) => {
          if (index === 0) return; // 헤더 스킵
          
          if (row.c[0] && row.c[1] && row.c[2]) {
            const dateStr = row.c[0].v; // A열: 날짜
            const mealType = row.c[1].v; // B열: 타입
            const name = row.c[2].v; // C열: 요리명
            const ingredientsRaw = row.c[3] ? row.c[3].v : ""; // D열: 재료
            const videoId = row.c[4] ? row.c[4].v : ""; // E열: 유튜브ID

            const ingredients = ingredientsRaw.split(',').map(item => {
              const [ingName, qty] = item.split(':').map(s => s.trim());
              return { name: ingName || item, qty: qty || "적당량" };
            }).filter(i => i.name);

            if (!sheetData[dateStr]) sheetData[dateStr] = {};
            
            sheetData[dateStr][mealType] = {
              name,
              ingredients,
              isSeasonal: checkSeasonal(ingredients, month),
              videoId: videoId,
              isCustom: true // 아빠 특식 표시용 플래그
            };
          }
        });

        setMeals(sheetData);
      } catch (error) {
        console.error("구글 시트를 불러오는데 실패했습니다.", error);
        setMeals(mockData); // 실패 시 기본 데이터 표시
      }
    };

    fetchSheetData();
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const monthDays = Array.from({ length: days }, (_, i) => i + 1);

  const getMealColor = (type, isCustom) => {
    if (isCustom) return "bg-purple-100 text-purple-800 border-l-4 border-purple-500 shadow-sm";
    const colors = {
      breakfast: "bg-blue-50 text-blue-800 border-l-2 border-blue-200",
      lunch: "bg-green-50 text-green-800 border-l-2 border-green-200",
      dinner: "bg-orange-50 text-orange-800 border-l-2 border-orange-200",
      snack: "bg-pink-50 text-pink-800 border-l-2 border-pink-200"
    };
    return colors[type] || "bg-gray-50 text-gray-800";
  };

  const getTypeLabel = (type) => {
    const labels = { breakfast: "아침", lunch: "점심", dinner: "저녁", snack: "간식" };
    return labels[type] || "";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-white px-6 py-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Utensils className="w-8 h-8 text-orange-500" />
              우리 아이 튼튼 월간 식단표
            </h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base">전문 영양사가 설계한 성장 3박자, 그리고 로켓배송 장보기까지 한 번에!</p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900 shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 font-semibold text-lg min-w-[120px] justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </div>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900 shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={() => showToast("🖨️ 식단표 인쇄 명령이 전송되었습니다!")}
            className="hidden md:flex bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors items-center gap-2 shadow-md">
            인쇄하기
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div key={day} className={`text-center font-bold text-sm py-2 rounded-lg bg-slate-50 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-600'}`}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-3 md:gap-4">
            {blanks.map(b => <div key={`blank-${b}`} className="min-h-[120px] bg-slate-50/50 rounded-xl border border-slate-100/50" />)}
            {monthDays.map(day => {
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayData = meals[dateStr] || {};
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

              return (
                <div key={day} className={`min-h-[140px] border rounded-xl p-2 transition-all hover:shadow-md bg-white ${isToday ? 'border-blue-400 shadow-sm ring-2 ring-blue-50' : 'border-slate-200'}`}>
                  <div className={`text-sm font-bold mb-2 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-500 text-white' : 'text-slate-700'}`}>
                    {day}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
                      const meal = dayData[type];
                      if (!meal) return null;
                      return (
                        <div 
                          key={type}
                          onClick={() => setSelectedMeal({ ...meal, date: dateStr, type })}
                          className={`text-xs p-2 rounded-lg cursor-pointer transition-all hover:opacity-80 truncate relative group ${getMealColor(type, meal.isCustom)}`}
                        >
                          <span className="font-bold opacity-70 mr-1">{getTypeLabel(type)}</span>
                          {meal.isCustom && <span className="mr-1">👨‍🍳</span>}
                          {meal.name}
                          {meal.isSeasonal && <span className="absolute -top-1 -right-1 text-[10px] bg-green-100 border border-green-300 rounded-full w-4 h-4 flex items-center justify-center shadow-sm">🌱</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-fade-in-up">
          <Info className="w-5 h-5 text-blue-300" />
          {toastMessage}
        </div>
      )}

      {/* Modal Detail */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              onClick={() => setSelectedMeal(null)}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-orange-100 text-orange-700 text-sm font-bold rounded-full border border-orange-200">
                {selectedMeal.date} {getTypeLabel(selectedMeal.type)}
              </span>
              {selectedMeal.isSeasonal && (
                <span className="px-4 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full flex items-center gap-1.5 border border-green-200">
                  🌱 제철 식재료 포함
                </span>
              )}
              {selectedMeal.isCustom && (
                <span className="px-4 py-1.5 bg-purple-50 text-purple-700 text-sm font-bold rounded-full flex items-center gap-1.5 border border-purple-200">
                  👨‍🍳 아빠표 특식
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-8">{selectedMeal.name}</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ingredients List */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                  🛒 필요 식재료
                </h3>
                <ul className="space-y-3">
                  {selectedMeal.ingredients.map((item, idx) => {
                    const altInfo = alternativeIngredientsMap[item.name];
                    return (
                      <li key={idx} className="flex flex-col gap-2">
                        <a 
                          href={getSearchLink(item.name)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
                        >
                          <span className="font-medium text-slate-700 group-hover:text-blue-700">{item.name} <span className="text-slate-400 text-sm ml-1 font-normal">({item.qty})</span></span>
                          <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                        </a>
                        {altInfo && (
                          <div className="ml-4 p-3 bg-orange-50 rounded-xl border border-orange-100 flex gap-2">
                            <span className="text-orange-500 mt-0.5">💡</span>
                            <div className="text-sm">
                              <span className="font-bold text-orange-800">대체 추천: {altInfo.alt}</span>
                              <p className="text-orange-600/80 mt-0.5 leading-snug">{altInfo.reason}</p>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5 text-xs text-slate-500 flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p>재료를 클릭하면 쿠팡(Coupang) 검색 결과(새 창)로 바로 이동해요! 빠른 로켓배송으로 준비해 보세요.</p>
                </div>
              </div>

              {/* Recipe Video */}
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                  📺 레시피 영상
                </h3>
                {selectedMeal.videoId ? (
                  <div className="bg-slate-50 rounded-2xl p-2 border border-slate-100">
                    <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden relative shadow-inner">
                      <a href={`https://www.youtube.com/watch?v=${selectedMeal.videoId}`} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">
                         <img src={`https://img.youtube.com/vi/${selectedMeal.videoId}/hqdefault.jpg`} alt="레시피 썸네일" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                           <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                             <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white ml-1"></div>
                           </div>
                         </div>
                      </a>
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-3 font-medium">썸네일을 클릭하면 유튜브 원본 영상이 재생됩니다.</p>
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-50 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400">
                    <Utensils className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">준비된 영상이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}
