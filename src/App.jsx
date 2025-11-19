import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CalendarCheck, 
  GraduationCap, 
  Plus, 
  Trash2, 
  ChevronRight, 
  LayoutDashboard, 
  BookOpen, 
  UserPlus,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  MoreVertical,
  LogOut,
  Settings
} from 'lucide-react';

// --- UI Components (Modern Style) ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false, size = "md" }) => {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const baseStyle = `rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-1 focus:outline-none`;
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm hover:shadow-indigo-200",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-200 shadow-sm",
    danger: "bg-white text-rose-600 border border-rose-100 hover:bg-rose-50 focus:ring-rose-200",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    link: "text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline px-0 py-0"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4">
    {label && <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm"
      />
    </div>
  </div>
);

const Avatar = ({ name, size = "sm" }) => {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const sizeClass = size === "lg" ? "w-12 h-12 text-lg" : "w-8 h-8 text-xs";
  
  // Generate consistent pastel color based on name length
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-indigo-100 text-indigo-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700"
  ];
  const colorClass = colors[name.length % colors.length];

  return (
    <div className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-bold border border-white shadow-sm shrink-0`}>
      {initials}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    H: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20",
    S: "bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/20",
    I: "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/20",
    A: "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/20",
  };
  
  const labels = { H: "Hadir", S: "Sakit", I: "Izin", A: "Alpa" };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ring-1 ring-inset ${styles[status] || "bg-slate-50 text-slate-600"}`}>
      {labels[status] || status}
    </span>
  );
};

// --- Main Application Component ---

export default function App() {
  // --- State Management (Sama seperti sebelumnya) ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]); 
  const [grades, setGrades] = useState([]); 
  
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(''); 
  const [tempInput, setTempInput] = useState({});
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [notification, setNotification] = useState(null);

  // --- Local Storage Sync ---
  useEffect(() => {
    const loadData = () => {
      try {
        const storedClasses = localStorage.getItem('sgp_classes');
        const storedStudents = localStorage.getItem('sgp_students');
        const storedAttendance = localStorage.getItem('sgp_attendance');
        const storedGrades = localStorage.getItem('sgp_grades');

        if (storedClasses) setClasses(JSON.parse(storedClasses));
        if (storedStudents) setStudents(JSON.parse(storedStudents));
        if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
        if (storedGrades) setGrades(JSON.parse(storedGrades));
      } catch (error) {
        console.error("Gagal memuat data", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('sgp_classes', JSON.stringify(classes));
    localStorage.setItem('sgp_students', JSON.stringify(students));
    localStorage.setItem('sgp_attendance', JSON.stringify(attendance));
    localStorage.setItem('sgp_grades', JSON.stringify(grades));
  }, [classes, students, attendance, grades]);

  // --- Helpers ---
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // --- Handlers ---
  const handleAddClass = () => {
    if (!tempInput.name) return;
    const newClass = { 
      id: generateId(), 
      name: tempInput.name, 
      subject: tempInput.subject || 'Umum' 
    };
    setClasses([...classes, newClass]);
    setTempInput({});
    setIsModalOpen(false);
    showNotification("Kelas berhasil dibuat");
  };

  const handleAddStudent = () => {
    if (!tempInput.name || !selectedClassId) return;
    const newStudent = {
      id: generateId(),
      name: tempInput.name,
      nis: tempInput.nis || '-',
      classId: selectedClassId
    };
    setStudents([...students, newStudent]);
    setTempInput({});
    setIsModalOpen(false);
    showNotification("Siswa ditambahkan");
  };

  const handleAttendance = (studentId, status) => {
    const existingRecordIndex = attendance.findIndex(
      r => r.studentId === studentId && r.date === attendanceDate
    );

    if (existingRecordIndex >= 0) {
      const newAttendance = [...attendance];
      newAttendance[existingRecordIndex].status = status;
      setAttendance(newAttendance);
    } else {
      const newRecord = {
        id: generateId(),
        date: attendanceDate,
        studentId,
        status
      };
      setAttendance([...attendance, newRecord]);
    }
  };

  const handleAddGrade = () => {
    if (!tempInput.title || !tempInput.score || !tempInput.studentId) return;
    const newGrade = {
      id: generateId(),
      studentId: tempInput.studentId,
      title: tempInput.title,
      score: parseFloat(tempInput.score)
    };
    setGrades([...grades, newGrade]);
    setTempInput(prev => ({ ...prev, score: '' })); 
    showNotification("Nilai tersimpan");
  };

  const handleDeleteClass = (id) => {
    if (window.confirm("Hapus kelas ini? Data siswa akan hilang.")) {
      setClasses(classes.filter(c => c.id !== id));
      setStudents(students.filter(s => s.classId !== id));
      setSelectedClassId(null);
      showNotification("Kelas dihapus", "danger");
    }
  };

  const handleDeleteStudent = (id) => {
    if(window.confirm("Hapus siswa ini?")) {
        setStudents(students.filter(s => s.id !== id));
        setAttendance(attendance.filter(a => a.studentId !== id));
        setGrades(grades.filter(g => g.studentId !== id));
    }
  };

  // --- Modern Views ---

  const DashboardView = () => {
    const totalClasses = classes.length;
    const totalStudents = students.length;
    const todayAttendance = attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length;
    
    const StatCard = ({ title, value, icon: Icon, trend, color }) => (
      <Card className="p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl ${color}`}>
            <Icon size={20} />
          </div>
          {trend && (
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} className="mr-1" /> {trend}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{value}</h3>
          <p className="text-sm font-medium text-slate-500">{title}</p>
        </div>
      </Card>
    );

    return (
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
            <p className="text-slate-500 mt-2 text-lg">Ringkasan aktivitas akademik Anda.</p>
          </div>
          <div className="hidden md:flex gap-3">
             <Button variant="secondary" onClick={() => {setModalMode('addClass'); setIsModalOpen(true)}}>
                <Plus size={18}/> Kelas Baru
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Kelas" 
            value={totalClasses} 
            icon={BookOpen} 
            color="bg-indigo-50 text-indigo-600"
          />
          <StatCard 
            title="Total Siswa" 
            value={totalStudents} 
            icon={Users} 
            color="bg-violet-50 text-violet-600"
            trend="+2 minggu ini"
          />
          <StatCard 
            title="Absensi Hari Ini" 
            value={todayAttendance} 
            icon={CalendarCheck} 
            color="bg-emerald-50 text-emerald-600"
          />
        </div>

        {totalClasses === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-slate-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Belum ada data</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Mulai perjalanan mengajar Anda dengan membuat kelas pertama.</p>
            <Button onClick={() => { setModalMode('addClass'); setIsModalOpen(true); }} className="mx-auto">
              Buat Kelas Sekarang
            </Button>
          </div>
        )}
      </div>
    );
  };

  const ClassManagerView = () => {
    const filteredStudents = students.filter(s => s.classId === selectedClassId);
    
    return (
      <div className="flex h-[calc(100vh-100px)] gap-6 max-w-7xl mx-auto">
        {/* Modern Sidebar List */}
        <div className="w-72 bg-white rounded-2xl border border-slate-200 flex flex-col h-full shadow-sm overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm">
            <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Daftar Kelas</h3>
            <button onClick={() => { setModalMode('addClass'); setIsModalOpen(true); }} className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-md transition-colors">
                <Plus size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {classes.length === 0 && <p className="text-center text-slate-400 py-10 text-sm">Belum ada kelas</p>}
            {classes.map(cls => (
              <div 
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex justify-between items-center group ${
                  selectedClassId === cls.id 
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' 
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${selectedClassId === cls.id ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                  <div>
                    <h4 className="font-semibold text-sm">{cls.name}</h4>
                    <p className="text-[10px] opacity-70 uppercase tracking-wider">{cls.subject}</p>
                  </div>
                </div>
                {selectedClassId === cls.id && <ChevronRight size={14} />}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col h-full shadow-sm overflow-hidden">
          {selectedClassId ? (
            <>
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{classes.find(c => c.id === selectedClassId)?.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {filteredStudents.length} Siswa Terdaftar
                  </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => handleDeleteClass(selectedClassId)}>
                        <Trash2 size={16} className="mr-2"/> Hapus Kelas
                    </Button>
                    <Button onClick={() => { setModalMode('addStudent'); setIsModalOpen(true); }}>
                        <UserPlus size={16} /> Tambah Siswa
                    </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 font-semibold uppercase bg-slate-50 sticky top-0 border-b border-slate-100 z-10">
                    <tr>
                      <th className="px-8 py-4 w-16">#</th>
                      <th className="px-6 py-4">Siswa</th>
                      <th className="px-6 py-4">Nomor Induk</th>
                      <th className="px-6 py-4 text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-20">
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <Users size={48} className="mb-4 text-slate-200" />
                                <p>Belum ada siswa. Tambahkan sekarang.</p>
                            </div>
                        </td>
                      </tr>
                    )}
                    {filteredStudents.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-4 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <Avatar name={student.name} />
                                <span className="font-medium text-slate-900">{student.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">{student.nis}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-slate-300 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="text-slate-300" size={24} />
              </div>
              <p className="text-slate-500">Pilih kelas dari menu di sebelah kiri.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AttendanceView = () => {
    if (!selectedClassId) {
      return (
        <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500">
           <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <CalendarCheck className="text-indigo-400" size={32} />
           </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Pilih Kelas</h3>
          <p className="mb-6">Silakan pilih kelas terlebih dahulu untuk memulai absensi.</p>
          <Button onClick={() => setActiveTab('classes')}>Ke Daftar Kelas</Button>
        </div>
      );
    }

    const classStudents = students.filter(s => s.classId === selectedClassId);
    const getStatus = (studentId) => {
      const record = attendance.find(a => a.studentId === studentId && a.date === attendanceDate);
      return record ? record.status : null;
    };

    const stats = {
        H: classStudents.filter(s => getStatus(s.id) === 'H').length,
        S: classStudents.filter(s => getStatus(s.id) === 'S').length,
        I: classStudents.filter(s => getStatus(s.id) === 'I').length,
        A: classStudents.filter(s => getStatus(s.id) === 'A').length,
    };

    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Absensi</h2>
                    <p className="text-slate-500 text-sm mt-1">Kelas: <span className="font-semibold text-indigo-600">{classes.find(c => c.id === selectedClassId)?.name}</span></p>
                </div>
                
                <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                    <button 
                        onClick={() => {
                            const d = new Date(attendanceDate);
                            d.setDate(d.getDate() - 1);
                            setAttendanceDate(d.toISOString().split('T')[0]);
                        }}
                        className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all"
                    >
                        <ChevronRight className="rotate-180" size={16} />
                    </button>
                    <input 
                        type="date" 
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="bg-transparent border-none text-slate-700 font-semibold focus:ring-0 text-sm"
                    />
                     <button 
                        onClick={() => {
                            const d = new Date(attendanceDate);
                            d.setDate(d.getDate() + 1);
                            setAttendanceDate(d.toISOString().split('T')[0]);
                        }}
                        className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mt-6">
                {[
                    { label: 'Hadir', count: stats.H, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { label: 'Sakit', count: stats.S, color: 'bg-blue-50 text-blue-700 border-blue-100' },
                    { label: 'Izin', count: stats.I, color: 'bg-amber-50 text-amber-700 border-amber-100' },
                    { label: 'Alpa', count: stats.A, color: 'bg-rose-50 text-rose-700 border-rose-100' }
                ].map((stat) => (
                    <div key={stat.label} className={`p-3 rounded-xl border flex items-center justify-between ${stat.color}`}>
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{stat.label}</span>
                        <span className="text-xl font-bold">{stat.count}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {classStudents.map(student => {
                const status = getStatus(student.id);
                return (
                <div key={student.id} className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Avatar name={student.name} />
                        <div>
                            <p className="font-semibold text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{student.nis}</p>
                        </div>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                        {['H', 'S', 'I', 'A'].map((type) => (
                            <button
                            key={type}
                            onClick={() => handleAttendance(student.id, type)}
                            className={`flex-1 sm:w-12 py-2 sm:py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                                status === type 
                                ? type === 'H' ? 'bg-emerald-500 text-white shadow-sm' 
                                : type === 'S' ? 'bg-blue-500 text-white shadow-sm'
                                : type === 'I' ? 'bg-amber-500 text-white shadow-sm'
                                : 'bg-rose-500 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                            >
                            {type}
                            </button>
                        ))}
                    </div>
                </div>
                )
            })}
        </div>
      </div>
    );
  };

  const GradingView = () => {
    if (!selectedClassId) return (
       <div className="flex flex-col items-center justify-center h-[80vh] text-slate-500">
           <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <GraduationCap className="text-indigo-400" size={32} />
           </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Pilih Kelas</h3>
          <p className="mb-6">Silakan pilih kelas untuk melihat buku nilai.</p>
          <Button onClick={() => setActiveTab('classes')}>Ke Daftar Kelas</Button>
        </div>
    );

    const classStudents = students.filter(s => s.classId === selectedClassId);
    const getStudentAverage = (studentId) => {
      const studentGrades = grades.filter(g => g.studentId === studentId);
      if (studentGrades.length === 0) return 0;
      const sum = studentGrades.reduce((acc, curr) => acc + curr.score, 0);
      return (sum / studentGrades.length).toFixed(1);
    };

    return (
      <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
        <header className="mb-6 flex justify-between items-center">
             <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Buku Nilai</h2>
                <p className="text-slate-500 text-sm">Rekapitulasi otomatis untuk {classes.find(c => c.id === selectedClassId)?.name}</p>
             </div>
        </header>
        
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 font-semibold uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 w-64 bg-slate-50">Siswa</th>
                  <th className="px-6 py-4 w-32 text-center bg-indigo-50/50 text-indigo-700 border-l border-r border-indigo-100">Rata-rata</th>
                  <th className="px-6 py-4">Riwayat Nilai</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {classStudents.map(student => {
                  const studentGrades = grades.filter(g => g.studentId === student.id);
                  const avg = getStudentAverage(student.id);
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <Avatar name={student.name} size="sm" />
                            <div>
                                <div className="font-medium text-slate-900">{student.name}</div>
                                <div className="text-xs text-slate-400 font-mono">{student.nis}</div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center bg-indigo-50/10 border-l border-r border-indigo-50">
                        <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${
                          avg >= 90 ? 'bg-emerald-100 text-emerald-700' :
                          avg >= 75 ? 'bg-blue-100 text-blue-700' :
                          avg > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {avg > 0 ? avg : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {studentGrades.map(g => (
                            <div key={g.id} className="group relative pl-2 pr-1 py-1 bg-white border border-slate-200 rounded text-xs flex items-center gap-2 hover:border-rose-200 hover:shadow-sm transition-all">
                              <span className="text-slate-500 font-medium">{g.title}</span>
                              <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">{g.score}</span>
                              <button 
                                onClick={() => {
                                  setGrades(grades.filter(gr => gr.id !== g.id));
                                  showNotification("Nilai dihapus", "danger");
                                }}
                                className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded p-0.5"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                          {studentGrades.length === 0 && <span className="text-slate-300 text-xs italic">Belum ada data nilai</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          className="ml-auto" 
                          onClick={() => {
                            setTempInput({ studentId: student.id, studentName: student.name });
                            setModalMode('addGrade');
                            setIsModalOpen(true);
                          }}
                        >
                          <Plus size={14} /> Input
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Modern Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] bg-[#0F172A] text-slate-400 h-full shrink-0 relative overflow-hidden">
        {/* Subtle Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>

        <div className="p-8 mb-6 relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30 text-white">
              <CheckCircle size={24} strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="font-bold text-white text-xl tracking-tight">Guru Pro</h1>
                <p className="text-xs font-medium text-indigo-400 tracking-widest uppercase">Admin Workspace</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 relative z-10">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'classes', icon: BookOpen, label: 'Kelas & Siswa' },
            { id: 'attendance', icon: CalendarCheck, label: 'Absensi' },
            { id: 'grading', icon: GraduationCap, label: 'Penilaian' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'} /> 
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto relative z-10">
          <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3 border border-white/5 backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold shadow-inner">
                GP
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Akun Pengajar</p>
                <p className="text-xs text-slate-500 truncate">Pro Plan Active</p>
            </div>
            <Settings size={16} className="ml-auto text-slate-500 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#F8FAFC]">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30">
          <span className="font-bold flex items-center gap-2 text-slate-900"><div className="bg-indigo-600 p-1 rounded text-white"><CheckCircle size={16} /></div> Guru Pro</span>
          <div className="flex gap-2">
             <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}><LayoutDashboard size={20}/></button>
             <button onClick={() => setActiveTab('classes')} className={`p-2 rounded-lg ${activeTab === 'classes' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}><BookOpen size={20}/></button>
             <button onClick={() => setActiveTab('attendance')} className={`p-2 rounded-lg ${activeTab === 'attendance' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}><CalendarCheck size={20}/></button>
             <button onClick={() => setActiveTab('grading')} className={`p-2 rounded-lg ${activeTab === 'grading' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}><GraduationCap size={20}/></button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className={`absolute top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 border ${
            notification.type === 'danger' 
                ? 'bg-white text-rose-600 border-rose-100' 
                : 'bg-slate-900 text-white border-slate-800'
          }`}>
            {notification.type === 'danger' ? <AlertCircle size={20} /> : <CheckCircle size={20} className="text-emerald-400" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 scroll-smooth">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'classes' && <ClassManagerView />}
          {activeTab === 'attendance' && <AttendanceView />}
          {activeTab === 'grading' && <GradingView />}
        </div>
      </main>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all scale-100">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                {modalMode === 'addClass' ? 'Buat Kelas Baru' : 
                 modalMode === 'addStudent' ? 'Registrasi Siswa' : 
                 'Input Nilai'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full p-1 transition-all"><X size={20} /></button>
            </div>
            <div className="p-6 pt-8">
              {modalMode === 'addClass' && (
                <div className="space-y-4">
                  <Input 
                    label="Nama Kelas" 
                    placeholder="Misal: 10 MIPA 1" 
                    value={tempInput.name || ''} 
                    onChange={v => setTempInput({...tempInput, name: v})} 
                  />
                  <Input 
                    label="Mata Pelajaran" 
                    placeholder="Misal: Matematika Wajib" 
                    value={tempInput.subject || ''} 
                    onChange={v => setTempInput({...tempInput, subject: v})} 
                  />
                  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-50">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                    <Button onClick={handleAddClass} disabled={!tempInput.name}>Simpan Kelas</Button>
                  </div>
                </div>
              )}

              {modalMode === 'addStudent' && (
                <div className="space-y-4">
                  <Input 
                    label="Nomor Induk (NIS)" 
                    placeholder="12345" 
                    value={tempInput.nis || ''} 
                    onChange={v => setTempInput({...tempInput, nis: v})} 
                  />
                  <Input 
                    label="Nama Lengkap" 
                    placeholder="Nama Siswa" 
                    value={tempInput.name || ''} 
                    onChange={v => setTempInput({...tempInput, name: v})} 
                  />
                  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-50">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                    <Button onClick={handleAddStudent} disabled={!tempInput.name}>Tambah Siswa</Button>
                  </div>
                </div>
              )}

              {modalMode === 'addGrade' && (
                <div className="space-y-4">
                  <div className="mb-6 flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <Avatar name={tempInput.studentName || 'S'} />
                    <div>
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Siswa</p>
                        <p className="font-medium text-indigo-900">{tempInput.studentName}</p>
                    </div>
                  </div>
                  <Input 
                    label="Judul Penilaian" 
                    placeholder="Misal: Quiz Bab 1" 
                    value={tempInput.title || ''} 
                    onChange={v => setTempInput({...tempInput, title: v})} 
                  />
                  <Input 
                    label="Nilai Akhir" 
                    type="number"
                    placeholder="0 - 100" 
                    value={tempInput.score || ''} 
                    onChange={v => setTempInput({...tempInput, score: v})} 
                  />
                  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-50">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                    <Button onClick={handleAddGrade} disabled={!tempInput.title || !tempInput.score}>Simpan Nilai</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}