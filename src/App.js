import React, { useState, useEffect } from 'react';

// 가벼운 로딩을 위해 lucide-react 대신 직접 SVG 아이콘 컴포넌트를 사용합니다.
const IconWrapper = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);
const ChevronLeft = ({className}) => <IconWrapper className={className}><polyline points="15 18 9 12 15 6"></polyline></IconWrapper>;
const ChevronRight = ({className}) => <IconWrapper className={className}><polyline points="9 18 15 12 9 6"></polyline></IconWrapper>;
const X = ({className}) => <IconWrapper className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></IconWrapper>;
const ChevronRightSm = ({className}) => <IconWrapper className={className}><polyline points="10 16 14 12 10 8"></polyline></IconWrapper>;
const Search = ({className}) => <IconWrapper className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></IconWrapper>;
const Printer = ({className}) => <IconWrapper className={className}><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></IconWrapper>;

const GOOGLE_SHEET_ID = "1pghEET0zyAht-7Ww4vuKQZ2jXWAe1zw-8vI7ujfO190";

// 고객님께서 업데이트하신 2026년 공휴일 (제헌절, 노동절 포함)
const holidayMap2026 = {
    "2026-01-01": "신정", "2026-02-16": "설날 연휴", "2026-02-17": "설날", "2026-02-18": "설날 연휴",
    "2026-03-01": "3·1절", "2026-03-02": "대체공휴일", "2026-05-01": "노동절", "2026-05-05": "어린이날",
    "2026-05-24": "부처님오신날", "2026-05-25": "대체공휴일", "2026-06-03": "지방선거", "2026-06-06": "현충일",
    "2026-07-17": "제헌절", "2026-08-15": "광복절", "2026-08-17": "대체공휴일", "2026-09-24": "추석 연휴",
    "2026-09-25": "추석", "2026-09-26": "추석 연휴", "2026-10-03": "개천절", "2026-10-05": "대체공휴일",
    "2026-10-09": "한글날", "2026-12-25": "성탄절"
};

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

// 업데이트된 영상 맵
const youtubeVideoMap = {
    "부드러운 소고기 미역국 정식": "z90ZqeqtPQY", "치즈 듬뿍 토마토 스파게티": "34l_H7hRyR4",
    "베이컨 계란 볶음밥": "14cysiLJkfg", "크림 카레 우동": "tU6q1rFcDL0",
    "짜장 떡볶이": "Rp94f6bXXeY", "영양만점 야채 계란찜과 밥": "PtK88koPxDI",
    "소화가 잘되는 닭가슴살 오트밀죽": "NpRDkTB98cc", "시금치 프리타타": "H4bxgz34ZR4",
    "포슬포슬 감자채 볶음과 스크램블": "pyxe0akVbww", "수제 두부 떡갈비": "oFt-dBUEi8w",
    "두뇌 발달 고등어 카레구이": "fMG8djO7JWw", "단짠단짠 저염 간장 돼지불고기": "iDXMaHk7geU",
    "야채 듬뿍 볶음밥과 맑은 국": "3edKOhCLdGM", "토마토 해산물 리조또": "Q4SQybIOUek",
    "수제 고구마 맛탕": "aXJgN_JjYDg", "제철 과일과 그릭 요거트": "KRsVZY80-NM",
    "부드러운 고구마 수프": "o1r_oZZIj5U", "단호박 훈제오리 찜": "rlIvmfGSXQ8",
    "우엉 김밥": "veDdwgDfPi4", "버섯 불고기 전골": "iDXMaHk7geU", 
    "새우살 애호박전": "lZQKn88nyIc", "달래 간장 비빔밥": "ceSuK8MVEb4",
    "채수 잔치국수": "Gq9S0dJ3wHg", "궁중 떡볶이": "WgKMwGqQRko" 
};

const generateMockMeals = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = {};

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

    const weekendBreakfastOptions = [
        { name: "우엉 김밥", ingredients: [{ name: "우엉조림", qty: "1팩" }, { name: "김밥용 김", qty: "5장" }, { name: "계란", qty: "3개" }] },
        { name: "채수 잔치국수", ingredients: [{ name: "소면", qty: "2인분" }, { name: "애호박", qty: "반개" }, { name: "다시마", qty: "1장" }] }
    ];

    const weekendLunchOptions = [
        { name: "짜장 떡볶이", ingredients: [{ name: "떡볶이 떡", qty: "300g" }, { name: "짜장가루", qty: "3T" }, { name: "양파", qty: "1/2개" }, { name: "대파", qty: "1대" }, { name: "베이컨", qty: "50g" }, { name: "설탕", qty: "1T" }, { name: "후추", qty: "1t" }, { name: "진간장", qty: "1T" }] },
        { name: "치즈 듬뿍 토마토 스파게티", ingredients: [{ name: "스파게티 면", qty: "140g" }, { name: "토마토 소스", qty: "400ml" }, { name: "소금", qty: "1t" }, { name: "후추", qty: "1t" }, { name: "굴소스", qty: "1T" }, { name: "진간장", qty: "2T" }, { name: "찬밥", qty: "2공기" }, { name: "참기름", qty: "1t" }, { name: "방울토마토", qty: "6~8개" }, { name: "통마늘", qty: "4개" }, { name: "양파", qty: "1/3개" }, { name: "베이컨", qty: "4줄" }, { name: "올리브 오일", qty: "2T" }, { name: "모짜렐라 치즈", qty: "한 줌" }] },
        { name: "베이컨 계란 볶음밥", ingredients: [{ name: "베이컨", qty: "5줄" }, { name: "마늘", qty: "10알" }, { name: "식용유", qty: "1T" }, { name: "계란", qty: "3개" }, { name: "대파", qty: "1개" }] },
        { name: "크림 카레 우동", ingredients: [{ name: "우동면", qty: "2개" }, { name: "양파", qty: "1/2개" }, { name: "소시지", qty: "2개" }, { name: "우유", qty: "400ml" }, { name: "고형 카레", qty: "40g" }, { name: "슬라이스 치즈", qty: "2장" }, { name: "오일", qty: "약간" }, { name: "크러쉬드레드페퍼", qty: "약간" }, { name: "파슬리 가루", qty: "약간" }] }
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

    const monthOffset = year + month;

    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dateObj = new Date(year, month, i);
        const dayOfWeek = dateObj.getDay(); 
        
        const isHoliday = !!holidayMap2026[dateStr];
        const isOffDay = dayOfWeek === 0 || dayOfWeek === 6 || isHoliday;

        let breakfastMenu, lunchMenu = null, dinnerMenu;
        
        if (isOffDay) {
            breakfastMenu = weekendBreakfastOptions[(i + monthOffset) % weekendBreakfastOptions.length];
            lunchMenu = weekendLunchOptions[(i + monthOffset) % weekendLunchOptions.length];
            dinnerMenu = weekendDinnerOptions[(i + monthOffset) % weekendDinnerOptions.length];
        } else {
            breakfastMenu = weekdayBreakfastOptions[(i + monthOffset) % weekdayBreakfastOptions.length];
            dinnerMenu = weekdayDinnerOptions[(i + monthOffset) % weekdayDinnerOptions.length];
        }

        const snackMenu = snackOptions[(i + monthOffset) % snackOptions.length];

        data[dateStr] = {
            breakfast: { ...breakfastMenu, isSeasonal: checkSeasonal(breakfastMenu.ingredients, month), videoId: youtubeVideoMap[breakfastMenu.name] || "" },
            dinner: { ...dinnerMenu, isSeasonal: checkSeasonal(dinnerMenu.ingredients, month), videoId: youtubeVideoMap[dinnerMenu.name] || "" }
        };

        if (lunchMenu) {
            data[dateStr].lunch = { ...lunchMenu, isSeasonal: checkSeasonal(lunchMenu.ingredients, month), videoId: youtubeVideoMap[lunchMenu.name] || "" };
        }

        if (i % 2 === 0 || isOffDay) {
            data[dateStr].snack = { ...snackMenu, isSeasonal: checkSeasonal(snackMenu.ingredients, month), videoId: youtubeVideoMap[snackMenu.name] || "" };
        }
    }
    return data;
};

const getSearchLink = (query) => `https://www.coupang.com/np/search?q=${encodeURIComponent(query)}`;

export default function App() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [meals, setMeals] = useState({});
    const [toastMessage, setToastMessage] = useState("");

    // 통합 스크립트: Tailwind CSS 로드
    useEffect(() => {
        if (!document.getElementById('tailwind-cdn')) {
            const script = document.createElement("script");
            script.id = "tailwind-cdn";
            script.src = "https://cdn.tailwindcss.com";
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

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
                    if (index === 0) return; 
                    
                    if (row.c[0] && row.c[1] && row.c[2]) {
                        const dateStr = row.c[0].v; 
                        const mealType = row.c[1].v; 
                        const name = row.c[2].v; 
                        const ingredientsRaw = row.c[3] ? row.c[3].v : ""; 
                        const videoId = row.c[4] ? row.c[4].v : ""; 

                        const ingredients = ingredientsRaw.split(',').map(item => {
                            const [ingName, qty] = item.split(':').map(s => s.trim());
                            return { name: ingName || item, qty: qty || "적당량" };
                        }).filter(i => i.name);

                        if (!sheetData[dateStr]) sheetData[dateStr] = {};
                        
                        sheetData[dateStr][mealType] = {
                            name, ingredients,
                            isSeasonal: checkSeasonal(ingredients, month),
                            videoId: videoId, isCustom: true 
                        };
                    }
                });

                setMeals(sheetData);
            } catch (error) {
                console.error("Failed to fetch Google Sheets.", error);
                setMeals(mockData); 
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

    // Toss Style Colors
    const getMealStyle = (type, isCustom) => {
        if (isCustom) return { bg: "bg-[#F3E8FF]", text: "text-[#7E22CE]", hover: "hover:bg-[#E9D5FF]" };
        const styles = {
            breakfast: { bg: "bg-[#FFF0ED]", text: "text-[#F04452]", hover: "hover:bg-[#FFE3DE]" },
            lunch:     { bg: "bg-[#E4F4E7]", text: "text-[#11883B]", hover: "hover:bg-[#D1EBD6]" },
            dinner:    { bg: "bg-[#E8F3FF]", text: "text-[#1B64DA]", hover: "hover:bg-[#D6E8FF]" },
            snack:     { bg: "bg-[#FFF4E6]", text: "text-[#F48000]", hover: "hover:bg-[#FFE8CC]" }
        };
        return styles[type] || { bg: "bg-[#F2F4F6]", text: "text-[#4E5968]", hover: "hover:bg-[#E5E8EB]" };
    };

    const getTypeLabel = (type) => {
        const labels = { breakfast: "아침", lunch: "점심", dinner: "저녁", snack: "간식" };
        return labels[type] || "";
    };

    return (
        <div className="min-h-screen py-6 px-4 md:px-10 selection:bg-[#3182F6] selection:text-white pb-20 font-toss">
            {/* 전역 스타일을 App.js에 포함시켜 styles.css 변경 없이도 완벽 작동 */}
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
                
                .font-toss {
                    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
                    background-color: #F2F4F6;
                    color: #191F28;
                }
                
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #D1D6DB; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #B0B8C1; }

                .toss-card {
                    background-color: #ffffff;
                    border-radius: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                }

                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade { animation: fadeIn 0.2s ease-out forwards; }
                
                @keyframes popIn { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .animate-pop { animation: popIn 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />

            {/* Header */}
            <header className="max-w-7xl mx-auto mb-8 animate-fade flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <p className="text-[#333D4B] font-semibold text-sm mb-1 text-[#3182F6]">우리 가족 스마트 대시보드</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#3182F6] tracking-tight">
                        유찬, 유준 튼튼 식단표
                    </h1>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center bg-white rounded-[16px] shadow-sm p-1">
                        <button onClick={handlePrevMonth} className="p-3 text-[#4E5968] hover:bg-[#F2F4F6] rounded-xl transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-[#333D4B] px-3 min-w-[100px] text-center text-lg">
                            {currentDate.getFullYear()}.{String(currentDate.getMonth() + 1).padStart(2, '0')}
                        </span>
                        <button onClick={handleNextMonth} className="p-3 text-[#4E5968] hover:bg-[#F2F4F6] rounded-xl transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => showToast("식단표가 인쇄 대기열에 추가되었어요.")}
                        className="hidden md:flex items-center gap-2 bg-[#3182F6] hover:bg-[#1B64DA] text-white px-5 py-3.5 rounded-[16px] font-bold transition-colors">
                        <Printer className="w-5 h-5" />
                        인쇄하기
                    </button>
                </div>
            </header>

            {/* Calendar Main */}
            <main className="max-w-7xl mx-auto animate-fade" style={{animationDelay: '0.1s'}}>
                <div className="w-full overflow-x-auto no-scrollbar pb-8">
                    <div className="min-w-[900px]">
                        
                        <div className="grid grid-cols-7 gap-3 mb-3 px-1">
                            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                                <div key={day} className={`text-center text-[15px] font-bold ${i === 0 ? 'text-[#F04452]' : i === 6 ? 'text-[#3182F6]' : 'text-[#8B95A1]'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-3">
                            {blanks.map(b => <div key={`blank-${b}`} className="min-h-[150px] rounded-[20px] bg-transparent" />)}
                            
                            {monthDays.map(day => {
                                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayData = meals[dateStr] || {};
                                
                                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                const isToday = new Date().toDateString() === dateObj.toDateString();
                                const isSunday = dateObj.getDay() === 0;
                                const isSaturday = dateObj.getDay() === 6;
                                const holidayName = holidayMap2026[dateStr];
                                
                                let dayNumColor = "text-[#191F28]";
                                if (isSunday || holidayName) dayNumColor = "text-[#F04452]";
                                else if (isSaturday) dayNumColor = "text-[#3182F6]";

                                return (
                                    <div key={day} className={`toss-card min-h-[160px] p-3 flex flex-col gap-2 relative ${isToday ? 'ring-2 ring-[#3182F6]' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <div className={`text-lg font-extrabold w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-[#3182F6] text-white' : dayNumColor}`}>
                                                {day}
                                            </div>
                                            {holidayName && (
                                                <span className="text-[11px] font-bold text-[#F04452] bg-[#FFF0ED] px-2 py-1 rounded-lg">
                                                    {holidayName}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1.5 flex-grow">
                                            {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
                                                const meal = dayData[type];
                                                if (!meal) return null;
                                                const style = getMealStyle(type, meal.isCustom);
                                                
                                                return (
                                                    <div 
                                                        key={type}
                                                        onClick={() => setSelectedMeal({ ...meal, date: dateStr, type })}
                                                        className={`px-2.5 py-2 rounded-xl cursor-pointer transition-colors ${style.bg} ${style.hover}`}
                                                    >
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1 mb-0.5">
                                                                <span className={`text-[11px] font-bold opacity-80 ${style.text}`}>{getTypeLabel(type)}</span>
                                                                {meal.isCustom && <span className="text-[10px]">👨‍🍳</span>}
                                                                {meal.isSeasonal && <span className="text-[10px]">🌱</span>}
                                                            </div>
                                                            <span className={`text-[13px] font-bold truncate ${style.text}`}>
                                                                {meal.name}
                                                            </span>
                                                        </div>
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
            </main>

            {/* Toast */}
            {toastMessage && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#333D4B] text-white px-6 py-4 rounded-2xl z-50 flex items-center gap-3 animate-pop shadow-lg whitespace-nowrap">
                    <span className="font-bold text-[15px]">{toastMessage}</span>
                </div>
            )}

            {/* Modal */}
            {selectedMeal && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-6 transition-all duration-300">
                    <div className="absolute inset-0 bg-black/40 animate-fade" onClick={() => setSelectedMeal(null)}></div>
                    
                    <div className="bg-white w-full max-w-2xl rounded-t-[24px] md:rounded-[24px] shadow-2xl relative flex flex-col max-h-[90vh] md:max-h-[85vh] animate-slide-up md:animate-pop overflow-hidden">
                        
                        <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
                            <div className="w-12 h-1.5 bg-[#D1D6DB] rounded-full"></div>
                        </div>

                        <button onClick={() => setSelectedMeal(null)} className="absolute top-4 right-4 p-2 bg-[#F2F4F6] hover:bg-[#E5E8EB] rounded-full text-[#8B95A1] transition-colors z-10 hidden md:block">
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="px-6 pt-2 pb-8 overflow-y-auto no-scrollbar">
                            <div className="mb-6 pt-4">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="px-3 py-1.5 bg-[#F2F4F6] text-[#4E5968] text-[13px] font-bold rounded-lg">
                                        {selectedMeal.date}
                                    </span>
                                    {selectedMeal.isSeasonal && <span className="px-3 py-1.5 bg-[#E4F4E7] text-[#11883B] text-[13px] font-bold rounded-lg flex items-center gap-1">🌱 제철 메뉴</span>}
                                    {selectedMeal.isCustom && <span className="px-3 py-1.5 bg-[#F3E8FF] text-[#7E22CE] text-[13px] font-bold rounded-lg flex items-center gap-1">👨‍🍳 아빠표 특식</span>}
                                </div>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-[#191F28] break-keep">{selectedMeal.name}</h2>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                <section>
                                    <h3 className="text-lg font-bold text-[#191F28] mb-3">레시피 보기</h3>
                                    {selectedMeal.videoId ? (
                                        <a href={`https://www.youtube.com/watch?v=${selectedMeal.videoId}`} target="_blank" rel="noopener noreferrer" 
                                           className="block relative rounded-[20px] overflow-hidden aspect-[16/9] bg-[#F2F4F6] group">
                                            <img src={`https://img.youtube.com/vi/${selectedMeal.videoId}/maxresdefault.jpg`} onError={(e) => {e.target.src=`https://img.youtube.com/vi/${selectedMeal.videoId}/hqdefault.jpg`}} alt="Thumbnail" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                                    <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-[#F04452] ml-1"></div>
                                                </div>
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="aspect-[21/9] rounded-[20px] bg-[#F2F4F6] flex flex-col items-center justify-center text-[#8B95A1]">
                                            <span className="text-3xl mb-2">🍽️</span>
                                            <p className="text-[15px] font-medium">영상이 없는 메뉴예요</p>
                                        </div>
                                    )}
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-[#191F28] mb-1">준비할 재료</h3>
                                    <p className="text-[14px] text-[#8B95A1] font-medium mb-3">재료를 누르면 로켓배송으로 바로 연결돼요</p>
                                    
                                    <div className="flex flex-col">
                                        {selectedMeal.ingredients.map((item, idx) => {
                                            const altInfo = alternativeIngredientsMap[item.name];
                                            
                                            return (
                                                <div key={idx} className="flex flex-col">
                                                    <a href={getSearchLink(item.name)} target="_blank" rel="noopener noreferrer" 
                                                       className="flex items-center justify-between p-3 -mx-3 rounded-2xl hover:bg-[#F2F4F6] transition-colors group cursor-pointer">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-[#F2F4F6] group-hover:bg-white flex items-center justify-center shrink-0">
                                                                <Search className="w-5 h-5 text-[#8B95A1]" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[17px] font-bold text-[#191F28]">{item.name}</span>
                                                                <span className="text-[14px] font-medium text-[#8B95A1] mt-0.5">{item.qty}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRightSm className="w-5 h-5 text-[#D1D6DB] group-hover:text-[#8B95A1]" />
                                                    </a>
                                                    
                                                    {altInfo && (
                                                        <div className="ml-14 mb-3 pl-4 border-l-2 border-[#FFC800]">
                                                            <span className="text-[13px] font-bold text-[#F48000]">추천 대안: {altInfo.alt}</span>
                                                            <p className="text-[14px] font-medium text-[#4E5968] mt-0.5 leading-snug">{altInfo.reason}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                                
                                <button onClick={() => setSelectedMeal(null)} className="w-full py-4 mt-2 bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#4E5968] rounded-2xl font-bold text-[16px] transition-colors md:hidden">
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
