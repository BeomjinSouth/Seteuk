'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    School,
    Calendar,
    Clock,
    Utensils,
    Users,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import styles from './page.module.css';

interface SchoolInfo {
    SCHUL_NM: string;
    ORG_RDNMA: string;
    HMPG_ADRES: string;
    COEDU_SC_NM: string;
    HS_SC_NM: string;
}

interface TimetableItem {
    GRADE: string;
    CLASS_NM: string;
    PERIO: string;
    ITRT_CNTNT: string;
    ALL_TI_YMD: string;
}

interface MealItem {
    MMEAL_SC_NM: string;
    MLSV_YMD: string;
    DDISH_NM: string;
    CAL_INFO: string;
    NTR_INFO: string;
}

interface ClassInfoItem {
    GRADE: string;
    CLASS_NM: string;
    SCHUL_NM: string;
}

interface ScheduleItem {
    AA_YMD: string;
    EVENT_NM: string;
    EVENT_CNTNT?: string;
    SBTR_DD_SC_NM?: string;
}

export default function SchoolInfoPage() {
    const { teacher } = useAppStore();

    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
    const [timetable, setTimetable] = useState<TimetableItem[]>([]);
    const [meals, setMeals] = useState<MealItem[]>([]);
    const [classInfo, setClassInfo] = useState<ClassInfoItem[]>([]);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [selectedGrade, setSelectedGrade] = useState('1');
    const [selectedClass, setSelectedClass] = useState('1');

    // Get school name from teacher profile
    const schoolName = teacher?.school || '성호중학교';

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    // Get date string for API
    const getDateString = (date: Date) => {
        return date.toISOString().slice(0, 10).replace(/-/g, '');
    };

    // Parse meal menu (remove allergen numbers)
    const parseMealMenu = (menu: string) => {
        if (!menu) return [];
        return menu.split('<br/>').map(item =>
            item.replace(/[0-9.()]/g, '').trim()
        ).filter(item => item);
    };

    // Fetch all data
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const dateStr = getDateString(selectedDate);

            // Get month range for schedule
            const startOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
            const endOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
            const fromDate = getDateString(startOfMonth);
            const toDate = getDateString(endOfMonth);

            const response = await fetch(
                `/api/neis?type=all&school=${encodeURIComponent(schoolName)}&grade=${selectedGrade}&class=${selectedClass}&date=${dateStr}&from=${fromDate}&to=${toDate}`
            );

            if (!response.ok) {
                throw new Error('API 호출 실패');
            }

            const result = await response.json();

            if (result.success) {
                const data = result.data;
                setSchoolInfo(data.school);
                setTimetable(data.timetable || []);
                setMeals(data.meal || []);
                setClassInfo(data.classInfo || []);
                setSchedule(data.schedule || []);
            } else {
                setError(result.error || '데이터를 불러올 수 없습니다.');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch and refetch when dependencies change
    useEffect(() => {
        fetchData();
    }, [selectedDate, selectedGrade, selectedClass, calendarMonth, schoolName]);

    // Navigate dates
    const prevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const nextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
        setCalendarMonth(new Date());
    };

    // Navigate months for calendar
    const prevMonth = () => {
        const newMonth = new Date(calendarMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        setCalendarMonth(newMonth);
    };

    const nextMonth = () => {
        const newMonth = new Date(calendarMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        setCalendarMonth(newMonth);
    };

    // Get unique grades from class info
    const grades = [...new Set(classInfo.map(c => c.GRADE))].sort();
    const classesInGrade = classInfo
        .filter(c => c.GRADE === selectedGrade)
        .map(c => c.CLASS_NM)
        .sort((a, b) => Number(a) - Number(b));

    // Group timetable by period
    const groupedTimetable = timetable
        .filter(t => t.GRADE === selectedGrade && t.CLASS_NM === selectedClass)
        .sort((a, b) => Number(a.PERIO) - Number(b.PERIO));

    // Calendar generation
    const calendarData = useMemo(() => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Start from previous Sunday (or Monday for Korean style)
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const weeks: Date[][] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= lastDay || weeks.length < 6) {
            const week: Date[] = [];
            for (let i = 0; i < 7; i++) {
                week.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(week);
            if (weeks.length >= 6) break;
        }

        return weeks;
    }, [calendarMonth]);

    // Get events for a specific date
    const getEventsForDate = (date: Date) => {
        const dateStr = getDateString(date);
        return schedule.filter(s => s.AA_YMD === dateStr);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === calendarMonth.getMonth();
    };

    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title} suppressHydrationWarning>
                        <School size={28} />
                        {schoolInfo?.SCHUL_NM || schoolName}
                    </h1>
                    <p className={styles.subtitle} suppressHydrationWarning>
                        {schoolInfo?.ORG_RDNMA || '학교 정보를 불러오는 중...'}
                    </p>
                </div>
                <Button onClick={fetchData} disabled={loading}>
                    <RefreshCw size={16} className={loading ? styles.spinning : ''} />
                    새로고침
                </Button>
            </header>

            {/* Date Navigation */}
            <div className={styles.dateNav}>
                <button className={styles.navBtn} onClick={prevDay}>
                    <ChevronLeft size={20} />
                </button>
                <div className={styles.dateDisplay}>
                    <Calendar size={18} />
                    <span suppressHydrationWarning>{formatDate(selectedDate)}</span>
                </div>
                <button className={styles.navBtn} onClick={nextDay}>
                    <ChevronRight size={20} />
                </button>
                <Button variant="secondary" size="sm" onClick={goToToday}>
                    오늘
                </Button>
            </div>

            {/* Grade/Class Selector */}
            <div className={styles.selectors}>
                <div className={styles.selectorGroup}>
                    <label>학년</label>
                    <div className={styles.selectorButtons}>
                        {[1, 2, 3].map(g => (
                            <button
                                key={g}
                                className={`${styles.selectorBtn} ${selectedGrade === String(g) ? styles.selected : ''}`}
                                onClick={() => setSelectedGrade(String(g))}
                            >
                                {g}학년
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.selectorGroup}>
                    <label>반</label>
                    <div className={styles.selectorButtons}>
                        {(classesInGrade.length > 0 ? classesInGrade : ['1', '2', '3', '4', '5']).map(c => (
                            <button
                                key={c}
                                className={`${styles.selectorBtn} ${selectedClass === c ? styles.selected : ''}`}
                                onClick={() => setSelectedClass(c)}
                            >
                                {c}반
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingState}>
                    <Loader2 size={48} className={styles.spinning} />
                    <p>데이터를 불러오는 중...</p>
                </div>
            ) : error ? (
                <div className={styles.errorState}>
                    <AlertCircle size={48} />
                    <p>{error}</p>
                    <Button onClick={fetchData}>다시 시도</Button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {/* Timetable */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Clock size={20} />
                            <h2>오늘의 시간표</h2>
                            <span className={styles.badge}>{selectedGrade}-{selectedClass}</span>
                        </div>
                        <div className={styles.cardBody}>
                            {groupedTimetable.length > 0 ? (
                                <div className={styles.timetableList}>
                                    {groupedTimetable.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className={styles.timetableRow}
                                        >
                                            <span className={styles.period}>{item.PERIO}교시</span>
                                            <span className={styles.subject}>{item.ITRT_CNTNT}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyMessage}>
                                    <BookOpen size={32} />
                                    <p>시간표 정보가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Meal Info */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Utensils size={20} />
                            <h2>오늘의 급식</h2>
                        </div>
                        <div className={styles.cardBody}>
                            {meals.length > 0 ? (
                                <div className={styles.mealList}>
                                    {meals.map((meal, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={styles.mealCard}
                                        >
                                            <div className={styles.mealType}>{meal.MMEAL_SC_NM}</div>
                                            <ul className={styles.menuList}>
                                                {parseMealMenu(meal.DDISH_NM).map((item, j) => (
                                                    <li key={j}>{item}</li>
                                                ))}
                                            </ul>
                                            {meal.CAL_INFO && (
                                                <div className={styles.calInfo}>{meal.CAL_INFO}</div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyMessage}>
                                    <Utensils size={32} />
                                    <p>급식 정보가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Class Info */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Users size={20} />
                            <h2>학급 정보</h2>
                        </div>
                        <div className={styles.cardBody}>
                            {classInfo.length > 0 ? (
                                <div className={styles.classGrid}>
                                    {grades.map(grade => (
                                        <div key={grade} className={styles.gradeGroup}>
                                            <div className={styles.gradeLabel}>{grade}학년</div>
                                            <div className={styles.classBadges}>
                                                {classInfo
                                                    .filter(c => c.GRADE === grade)
                                                    .sort((a, b) => Number(a.CLASS_NM) - Number(b.CLASS_NM))
                                                    .map((c, i) => (
                                                        <span key={i} className={styles.classBadge}>
                                                            {c.CLASS_NM}반
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyMessage}>
                                    <Users size={32} />
                                    <p>학급 정보가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Calendar Schedule */}
                    <section className={`${styles.card} ${styles.calendarCard}`}>
                        <div className={styles.cardHeader}>
                            <Calendar size={20} />
                            <h2>학사일정</h2>
                            <div className={styles.calendarNav}>
                                <button className={styles.calNavBtn} onClick={prevMonth}>
                                    <ChevronLeft size={16} />
                                </button>
                                <span className={styles.calendarMonth} suppressHydrationWarning>
                                    {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
                                </span>
                                <button className={styles.calNavBtn} onClick={nextMonth}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.calendar}>
                                {/* Day headers */}
                                <div className={styles.calendarHeader}>
                                    {dayNames.map((day, i) => (
                                        <div
                                            key={day}
                                            className={`${styles.calendarDayName} ${i === 0 ? styles.sunday : ''} ${i === 6 ? styles.saturday : ''}`}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar grid */}
                                <div className={styles.calendarGrid}>
                                    {calendarData.map((week, weekIndex) => (
                                        week.map((date, dayIndex) => {
                                            const events = getEventsForDate(date);
                                            const hasHoliday = events.some(e => e.SBTR_DD_SC_NM === '공휴일');

                                            return (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className={`${styles.calendarCell} 
                                                        ${!isCurrentMonth(date) ? styles.otherMonth : ''} 
                                                        ${isToday(date) ? styles.today : ''}
                                                        ${dayIndex === 0 || hasHoliday ? styles.sundayCell : ''}
                                                        ${dayIndex === 6 ? styles.saturdayCell : ''}`}
                                                >
                                                    <span className={styles.dateNumber}>{date.getDate()}</span>
                                                    <div className={styles.eventList}>
                                                        {events.slice(0, 2).map((event, i) => (
                                                            <div
                                                                key={i}
                                                                className={`${styles.eventItem} ${event.SBTR_DD_SC_NM === '공휴일' ? styles.holidayEvent : ''}`}
                                                                title={event.EVENT_NM}
                                                            >
                                                                {event.EVENT_NM.length > 6
                                                                    ? event.EVENT_NM.slice(0, 6) + '...'
                                                                    : event.EVENT_NM}
                                                            </div>
                                                        ))}
                                                        {events.length > 2 && (
                                                            <span className={styles.moreEvents}>+{events.length - 2}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
