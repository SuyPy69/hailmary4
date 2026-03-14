import React, { useState, useEffect, useMemo } from "react";
import { Activity, LayoutGrid, Database, Search, Settings, ArrowRight, User, Building2, ArrowLeft, MapPin, X, ChevronDown, Menu, Map as MapIcon, Moon, Sun, Heart, Award, AlertTriangle, Plus, Minus } from "lucide-react";
import EmsDiversionMap from "./components/EmsDiversionMap";

// --- 100% BULLETPROOF DATA (GEO-MAPPED PINCODES) ---
const rawCSVData = `id,name,location,pincode,O_pos,O_neg,A_pos,A_neg,B_pos,B_neg,AB_pos,AB_neg
157,Chord Road Hospital Pvt Ltd,"12.998121,77.540484",560079,121,25,88,16,150,11,7,6
158,Pristline Hospital,"12.997893,77.543613",560079,110,22,129,21,186,31,35,27
159,Manipal Northside Hospital,"13.001128,77.563929",560003,129,48,150,12,108,21,63,19
160,Mallya Audikesh Diagnostics Center,"12.981505,77.601194",560001,142,24,82,9,180,43,27,30
161,Mallige Medical Centre,"12.985247,77.580385",560001,142,27,85,13,139,27,31,0
162,Government Maternity Hospital,"12.998860,77.581742",560003,166,22,100,31,124,29,26,38
163,Soujanya Clinic,"12.968119,77.543250",560040,93,7,86,7,141,13,13,26
164,Hospital,"13.004364,77.565296",560003,85,12,69,20,96,16,27,3
165,Suprabha Hospital,"13.007938,77.546906",560086,126,41,79,15,122,4,23,39
166,Sangolli Nursing Home,"13.008356,77.546927",560086,179,7,81,3,107,2,20,71
167,Diacon Hospital,"13.003768,77.549834",560010,128,11,131,14,116,15,43,4
168,Namratha Hospital,"13.004786,77.543073",560086,144,22,116,12,151,31,44,37
170,Fortis Hospital,"13.002241,77.549088",560086,155,9,66,15,118,0,61,14
171,Citi Hospital,"12.995651,77.551070",560010,104,47,120,24,173,24,10,27
172,Vasan Eye Care Hospital,"12.999522,77.550533",560010,116,33,109,26,118,2,26,33
173,Ananya Hospital,"12.999821,77.550450",560010,135,16,65,13,138,40,46,1
174,Baptist,"12.997091,77.571977",560003,118,20,110,27,112,0,37,5
175,Shivakrupa Hospital,"12.973967,77.547914",560040,136,14,78,20,116,6,26,38
176,Sri Maruthi hospital,"12.992644,77.574205",560020,100,6,107,1,172,19,40,24
177,Gayathri Hospital,"12.974405,77.542682",560040,143,8,88,38,144,38,86,4
178,Cloud Nine Hospital,"13.007874,77.562532",560003,118,27,68,7,127,34,12,10
179,Nayak Hospital,"12.999386,77.560640",560021,150,43,71,22,113,0,69,35
180,Shanbhag Hospital,"12.985688,77.543542",560079,115,18,72,0,125,17,48,36
181,Trupti Nursing Home,"12.994657,77.539754",560079,164,4,88,4,171,22,45,21
182,Krupa Medical center,"13.000431,77.541166",560010,120,17,104,15,128,64,35,12
183,Penta Care Ayurvedic Hospital,"12.973689,77.536948",560040,114,46,121,28,121,23,39,16
184,Shreya Poly Clinic,"12.972913,77.539472",560040,49,8,72,48,67,23,47,5
185,Pragathi Ayurvedic Center,"12.984370,77.555666",560010,118,7,112,24,124,13,32,46
186,Leela Hospital and Diagnostic Center,"13.000267,77.569489",560003,132,14,69,0,123,30,48,23
187,Dr. Rajkumar Blood Bank,"12.968031,77.587822",560001,152,21,36,38,124,21,28,22
188,Shifa Hospital,"12.990011,77.598811",560001,115,0,96,14,120,20,27,10
189,Hospital,"12.976705,77.542417",560040,123,27,71,33,126,29,35,25
190,Dr Raos Maternity Hospital,"12.985042,77.546048",560079,131,15,113,30,200,37,67,8
191,Shiva Kumaraswamy Building,"12.971705,77.549372",560053,137,3,72,20,113,10,29,42
192,Dr Solankis Eye Hospital,"12.995163,77.573814",560020,138,35,52,21,113,15,29,14
193,Sri Sanjeevini Cold Laser Therapy,"13.005392,77.571335",560003,119,33,83,34,169,17,65,26
194,St. Martha's Heart Centre,"12.970544,77.583477",560001,88,37,28,1,97,8,81,9
195,Desai Nursing Home,"12.986374,77.579315",560001,84,40,125,12,112,15,18,10
196,Fortis Hospital,"12.988165,77.554818",560010,112,6,73,16,127,30,50,21
197,Ayushman Ayurvedic therapy centre,"12.994616,77.602387",560001,104,6,120,2,129,13,36,12
198,Pristine Hospital,"12.998423,77.540389",560010,142,5,100,23,114,0,21,30
199,Arogya Kendra,"12.973589,77.544328",560040,157,13,45,27,168,9,23,0
200,The Family Doctor Malleswaram,"13.002969,77.552667",560010,188,20,97,5,147,29,21,66
201,V Care Medical Systems P Ltd,"12.978705,77.540358",560079,133,0,38,0,90,28,15,3
202,Saikrupa Hospital For Women's and Surgical Centre,"12.969166,77.535192",560040,116,17,74,26,130,6,52,31
203,Cutis Academy of Cutaneous Sciences,"12.976812,77.544909",560040,164,32,114,4,121,11,71,10
204,Vijayanagar Global Hospital,"12.971790,77.537286",560040,109,16,71,22,135,10,16,13
205,The Homoeo World,"12.994720,77.571588",560003,112,21,104,31,144,32,45,4
206,Tamara Hospital & IVF Centre,"13.004450,77.553076",560010,148,20,83,19,118,5,71,18
207,ChanRe Rheumatology and Immunology Center,"12.995573,77.535421",560079,149,33,94,14,146,48,47,32
208,Manasa Hospital,"12.970946,77.545106",560040,99,29,95,1,105,18,41,11
209,Cauvery Orthopaedic Centre,"12.998489,77.550422",560010,109,9,102,32,110,25,51,13
210,Nethradhama Superspeciality Eye Hospital,"12.997613,77.550942",560021,139,25,72,23,110,0,50,16
211,Hosmat Hospital,"13.008000,77.583748",560003,171,15,129,33,125,9,29,38
212,Altius Hospital,"12.984954,77.556922",560010,131,17,78,8,80,42,58,30
213,Bangalore Diabetes Hospital,"12.991841,77.596853",560001,115,31,90,13,170,51,10,6
214,Vathsalya Speciality Hospital,"12.993975,77.539180",560079,123,32,112,27,187,19,61,8
215,Maruthi Hospital,"12.967761,77.541328",560072,152,39,96,8,157,9,84,17
216,The Eye Surgical Centre,"12.982195,77.549314",560010,100,42,85,21,138,38,69,25
217,Dr. Agrawal's Eye Hospital,"12.999898,77.550112",560004,165,15,137,4,139,18,32,25
218,Ashok Hospital,"12.994891,77.534798",560079,162,49,108,13,113,17,11,4
219,Dr. B. Venkatasubbarao Memorial Hospital,"12.998198,77.568151",560003,119,13,102,30,139,32,52,1
220,Jupiter Hospital And Institute,"12.999846,77.566365",560003,127,37,88,41,163,1,32,7
221,Radha Maternity and Surgical Hospital,"12.969044,77.568854",560053,135,7,79,0,122,14,25,31
222,Hitech Kidney Stone Hospital,"12.987810,77.580983",560001,162,34,105,33,138,32,20,0
223,Sri Dhavantari Ayurveda Hoapital,"12.982219,77.559937",560010,141,13,98,29,150,13,57,15
224,Vaidyam Hospital,"12.984551,77.552832",560040,178,40,73,33,181,5,46,26
225,Suresh Hospital - Bangalore,"12.989774,77.555101",560010,120,31,125,36,85,42,58,7
226,Lakshmi Maternity Home,"13.005823,77.569451",560055,110,2,94,0,134,6,20,0
227,Manjunatha Maternity Home and Surgical Centre,"13.007727,77.569699",560055,118,5,136,11,111,23,59,16
228,Samprathi Eye Hospital And Squint Centre,"12.993281,77.580691",560020,154,30,84,34,159,36,75,2
229,Shankara Nethralaya Eye Hospital,"13.008995,77.540619",560096,147,18,108,26,152,37,29,12
230,ChanRe Rheumatology and Immunology Center,"12.999208,77.550269",560010,128,50,79,34,141,0,33,18
231,Malleswaram Eye Day Care Hospital,"12.996668,77.571604",560003,123,13,98,0,101,54,45,20
232,Mahaveer Eye Hospital Private Limited,"12.993355,77.572959",560020,160,5,73,6,137,24,41,27
233,Bilva Hospital,"12.998983,77.580202",560003,139,1,74,19,129,3,23,25
234,Anugraha Hospital,"12.976565,77.545588",560079,139,37,95,31,114,15,64,30
235,Amar Hospital,"12.971182,77.578123",560053,168,52,93,30,160,5,67,50
236,Supriya Hospital,"12.992904,77.558802",560021,109,19,65,18,89,4,22,1
237,Sidvin Hospital Pvt Ltd,"12.982442,77.549368",560010,113,29,108,21,163,16,43,23
238,Place Guttahalli Maternity Home,"12.998824,77.581989",560003,120,12,107,2,184,44,30,21
239,Namratha Nursing And Maternity Home,"13.004575,77.543273",560086,123,32,96,16,128,8,76,15
240,Spine Care And Ortho Care Hospital,"12.974513,77.549388",560086,111,18,85,6,133,28,41,22
241,Tanmay Hospital,"12.973376,77.547403",560040,111,20,126,15,156,19,59,12
242,Vijayanagar Hospital,"12.971629,77.537197",560040,132,5,82,12,87,45,29,22
243,Punarjyoti Eye Hospital,"12.968530,77.584396",560002,147,13,71,32,152,37,49,1
244,Sreeniwasa Hospital,"12.973271,77.572536",560053,163,30,121,23,128,9,47,12
245,Magadi Road Maternity Home,"12.974125,77.561823",560023,68,25,64,50,90,5,48,3
246,Pristine Hospital,"12.998001,77.543278",560086,180,74,97,2,123,17,14,26
247,Punya Hospital,"12.986216,77.537485",560079,183,24,72,34,135,37,36,0
248,Sri Ranga Arogyadhama,"12.998624,77.542782",560086,143,28,103,11,146,30,79,39
249,Rotary Eye Hospital,"12.981723,77.554936",560010,88,18,73,36,165,13,36,35
250,Gurukripa Hospital,"13.000180,77.546115",560086,158,32,76,22,130,29,41,19
251,Madhu Hospital,"12.978316,77.542960",560079,118,19,109,0,100,14,38,33
252,Padmashree Diagnostics,"12.974598,77.543679",560079,149,30,110,13,110,45,39,21
253,K.C. General Hospital,"12.993382,77.569417",560003,99,6,105,21,99,0,75,6
254,Yashas Neurocare,"12.985399,77.545402",560079,101,4,123,14,143,26,38,19
255,Focus Diagnostic Center,"12.987063,77.549951",560010,129,17,50,20,143,32,5,19
256,Kamadhenu Hospital,"12.975501,77.534972",560040,101,25,77,62,99,18,31,3
257,Goverment Hospital,"12.974493,77.534205",560040,112,26,83,19,135,22,29,25
258,Sriprasad Ayurveda,"12.973409,77.546281",560040,116,28,133,14,122,0,55,14
259,Vidya Eye Hospital,"12.970743,77.537768",560040,104,5,91,5,157,31,41,45
260,G.R. Hospital,"12.980230,77.554882",560010,91,27,42,47,68,19,24,27
261,Sneha Horizon Hospital,"12.975430,77.535800",560040,124,16,94,19,99,14,12,21
262,Kangroo Hospital,"12.974339,77.542325",560040,114,13,111,9,116,40,42,14
263,Abhinav Hospital,"12.975749,77.553782",560023,102,1,96,12,153,5,31,2
264,Suhusannidhi Hospital,"12.969102,77.534951",560040,103,13,67,13,161,22,46,12
265,Manavarthapet Pregnancy Hospital,"12.970255,77.573457",560053,139,26,102,11,105,37,18,17
266,Sharada Hospital,"12.973479,77.575037",560053,171,49,113,31,109,33,39,28
267,Prabha Eye Clinic & Research Centre,"12.970347,77.575892",560053,130,2,80,8,98,28,68,11
268,Ashwini Hospital,"12.970597,77.581561",560001,156,1,72,11,85,6,43,18
269,Maruthi Nursing Home,"12.972370,77.568340",560053,127,10,127,10,111,17,45,21
270,B.R. Nursing Home,"12.971032,77.542526",560040,84,33,106,20,147,15,44,14
271,K.G. Hospital,"12.976535,77.547164",560079,150,16,101,23,153,11,46,19
272,Vidyasagara Clinic,"12.990422,77.560126",560021,154,23,59,38,103,1,19,4
273,Raja Clinic,"12.992671,77.556272",560021,123,0,91,37,162,18,36,25
274,Esi Hospital Bangalore,"12.990498,77.553092",560010,120,47,117,14,136,15,31,23
275,S.R.S. Hospital,"13.003923,77.544715",560086,169,38,103,26,111,26,13,22
276,Atharva Ayurdhama Ayurvedic Hospital,"13.004314,77.547749",560010,96,17,125,20,124,21,43,20
277,RICH CARE HOMEOPATHY,"13.001546,77.572168",560003,137,41,81,21,129,0,15,35
278,Poornayu Ayurveda Hospital,"12.998238,77.551173",560010,102,12,91,28,104,30,28,30
279,Appllo Diagnostic,"12.998106,77.600813",560001,150,18,108,10,184,20,52,3
280,Supra Diagnostics Spine Care,"12.997000,77.573004",560003,69,8,89,1,92,20,41,6
281,K.C.General Hospital,"12.996024,77.569371",560003,139,21,105,8,129,24,44,57`;

const parseCSV = (csv) => {
  return csv.trim().split('\n').slice(1).map(row => {
    const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    return {
      id: parseInt(cols[0]), name: cols[1] ? cols[1].replace(/"/g, '') : "Unknown Node",
      location: cols[2] ? cols[2].replace(/"/g, '') : "0,0", pincode: cols[3],
      O_pos: parseInt(cols[4]) || 0, O_neg: parseInt(cols[5]) || 0,
      A_pos: parseInt(cols[6]) || 0, A_neg: parseInt(cols[7]) || 0,
      B_pos: parseInt(cols[8]) || 0, B_neg: parseInt(cols[9]) || 0,
      AB_pos: parseInt(cols[10]) || 0, AB_neg: parseInt(cols[11]) || 0
    };
  });
};

const fallbackHospitals = parseCSV(rawCSVData);

// --- BACKGROUND ANIMATION ---
const FloatingRBCs = () => {
  const cells = Array.from({ length: 15 }).map((_, i) => ({
    id: i, size: Math.random() * 60 + 30, left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh`, delay: `${Math.random() * 5}s`, duration: `${Math.random() * 10 + 10}s`
  }));
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {cells.map(cell => <div key={cell.id} className="rbc-particle" style={{ width: `${cell.size}px`, height: `${cell.size}px`, left: cell.left, top: cell.top, animationDelay: cell.delay, animationDuration: cell.duration }} />)}
    </div>
  );
};

const App = () => {
  // --- THEME ENGINE ---
  const [theme, setTheme] = useState('light');
  const isDark = theme === 'dark';

  const bgBase = isDark ? 'bg-[#050505]' : 'bg-[#f8f9fa]';
  const bgCard = isDark ? 'bg-[#111111]' : 'bg-white';
  const textMain = isDark ? 'text-white' : 'text-black';
  const textMuted = isDark ? 'text-neutral-500' : 'text-neutral-400';
  const borderMain = isDark ? 'border-neutral-800' : 'border-neutral-200';
  const inverseBg = isDark ? 'bg-white' : 'bg-black';
  const inverseText = isDark ? 'text-black' : 'text-white';
  const rowHover = isDark ? 'hover:bg-neutral-900/50' : 'hover:bg-red-50/50';

  // --- AUTH STATE ---
  const [authStep, setAuthStep] = useState('role');
  const [userType, setUserType] = useState(null);
  const [inputId, setInputId] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  // --- MAIN APP STATE ---
  const [hospitals, setHospitals] = useState(fallbackHospitals);
  const [predictions, setPredictions] = useState({});
  const [selectedType, setSelectedType] = useState('O_neg');
  const [isOnline, setIsOnline] = useState(true);

  // --- NEW: SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState("");

  // --- POPUP STATE ---
  const [showProfile, setShowProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // --- LIVE INVENTORY UPDATERS ---
  const updateStock = (hospId, bgType, delta) => {
    setHospitals(prev => prev.map(h => {
      if (h.id === hospId) {
        const newVal = Math.max(0, (h[bgType] || 0) + delta);
        return { ...h, [bgType]: newVal };
      }
      return h;
    }));
  };

  const updateStockExact = (hospId, bgType, val) => {
    setHospitals(prev => prev.map(h => {
      if (h.id === hospId) {
        return { ...h, [bgType]: Math.max(0, val) };
      }
      return h;
    }));
  };

  useEffect(() => {
    if (authStep !== 'authenticated') return;
    const fetchTelemetry = () => {
      const pMap = {};
      hospitals.forEach(n => { pMap[n.id] = { is_critical: Math.random() > 0.8 }; });
      setPredictions(pMap);
    };
    fetchTelemetry();
    const timer = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(timer);
  }, [authStep, hospitals]);

  const metrics = useMemo(() => {
    if (!hospitals.length) return { val: "0.0", crit: 0 };
    const critNodes = hospitals.filter(h => {
        const analysis = predictions?.[h.id];
        return analysis ? analysis.is_critical : (h[selectedType] < 15);
    });
    const val = (((hospitals.length - critNodes.length) / hospitals.length) * 100).toFixed(1);
    return { val, crit: critNodes.length };
  }, [hospitals, predictions, selectedType]);

  const handleIdSubmit = (e) => {
    e.preventDefault();
    if (inputId.trim().length >= 1) {
      if (userType === 'individual') setAuthStep('location');
      else setAuthStep('authenticated');
    }
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeError("Invalid Pincode");
      return;
    }
    setPincodeError("");
    if (city.trim()) setAuthStep('authenticated');
  };

  const handleLogout = () => {
    setAuthStep('role'); setInputId(""); setCity(""); setPincode(""); setSearchQuery("");
    setShowProfile(false); setIsMenuOpen(false); setActiveModal(null);
  };

  // --- NEW: DYNAMIC SEARCH FILTER FOR THE TABLE ---
  const displayedHospitals = useMemo(() => {
    if (!hospitals.length) return [];

    let baseList = [...hospitals];

    // If there is an active search, filter the entire 135-hospital list globally!
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      return baseList.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.id.toString() === q
      ).map(h => ({
        ...h,
        simulatedDistance: h.simulatedDistance || (Math.random() * 15 + 1).toFixed(1)
      })).slice(0, 15); // Show up to 15 search results
    }

    // If NO search, just show the normal "Top 10 Nearest"
    return baseList
      .slice(0, 10)
      .map((h, i) => ({ ...h, simulatedDistance: (Math.random() * 4 + 0.5 + (i * 0.2)).toFixed(1) }))
      .sort((a, b) => parseFloat(a.simulatedDistance) - parseFloat(b.simulatedDistance));
  }, [hospitals, pincode, searchQuery]);

  // ==========================================
  // VIEW 1: PRE-LOGIN PORTALS
  // ==========================================
  if (authStep !== 'authenticated') {
    return (
      <div className={`flex h-screen w-screen items-center justify-center font-sans relative selection:bg-red-200 transition-colors duration-500 ${bgBase}`}>
        <FloatingRBCs />
        <div className={`${bgCard} border ${borderMain} p-10 rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden transition-colors`}>
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
          <div className={`flex items-center gap-3 mb-2 font-black text-3xl tracking-tight justify-center ${textMain}`}>
             <Activity size={36} className="text-red-600" /> BloodLink.
          </div>
          <p className={`text-xs font-bold ${textMuted} mb-8 uppercase tracking-[3px] text-center`}>Identity Verification</p>

          {authStep === 'role' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <button onClick={() => { setUserType('organization'); setAuthStep('organization'); }} className={`w-full flex items-center justify-between p-6 ${bgCard} border-2 ${borderMain} rounded-2xl ${isDark ? 'hover:border-white hover:bg-[#1a1a1a]' : 'hover:border-black hover:bg-neutral-50'} transition-all group`}>
                 <div className="flex items-center gap-4">
                    <div className={`p-3 ${inverseBg} ${inverseText} rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors`}><Building2 size={24} /></div>
                    <div className="text-left">
                       <p className={`text-lg font-black uppercase tracking-tight ${textMain}`}>Organization</p>
                       <p className={`text-xs font-bold ${textMuted}`}>Hospitals & Blood Banks</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className={`${textMuted} group-hover:${textMain} group-hover:translate-x-1 transition-all`} />
              </button>

              <button onClick={() => { setUserType('individual'); setAuthStep('individual'); }} className={`w-full flex items-center justify-between p-6 ${bgCard} border-2 ${borderMain} rounded-2xl ${isDark ? 'hover:border-white hover:bg-[#1a1a1a]' : 'hover:border-black hover:bg-neutral-50'} transition-all group`}>
                 <div className="flex items-center gap-4">
                    <div className={`p-3 border ${borderMain} ${textMain} rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors`}><User size={24} /></div>
                    <div className="text-left">
                       <p className={`text-lg font-black uppercase tracking-tight ${textMain}`}>Individual</p>
                       <p className={`text-xs font-bold ${textMuted}`}>Donors & Patients (ABHA)</p>
                    </div>
                 </div>
                 <ArrowRight size={20} className={`${textMuted} group-hover:${textMain} group-hover:translate-x-1 transition-all`} />
              </button>
            </div>
          )}

          {(authStep === 'individual' || authStep === 'organization') && (
            <form onSubmit={handleIdSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <button type="button" onClick={() => { setAuthStep('role'); setInputId(""); }} className={`flex items-center gap-2 text-[10px] font-bold ${textMuted} hover:${textMain} uppercase tracking-widest mb-6 transition-colors`}>
                <ArrowLeft size={12} /> Back
              </button>
              <div>
                <label className={`block text-xs font-black ${textMain} uppercase tracking-wider mb-3 text-center`}>
                  {userType === 'individual' ? 'Enter 14-Digit ABHA ID' : 'Enter 3-Digit Hospital ID (e.g. 157)'}
                </label>
                <input type="text" required autoFocus value={inputId} onChange={(e) => setInputId(e.target.value)}
                  placeholder={userType === 'individual' ? "XX-XXXX-XXXX-XXXX" : "HOSP-ID"}
                  className={`w-full border-2 ${borderMain} p-4 rounded-xl text-2xl font-black text-red-600 ${bgBase} ${textMain} outline-none focus:border-red-600 focus:ring-4 focus:ring-red-500/20 transition-all text-center tracking-[4px]`}
                />
              </div>
              <button type="submit" className={`w-full ${inverseBg} ${inverseText} font-black text-sm uppercase tracking-widest p-5 rounded-xl hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2 group`}>
                {userType === 'individual' ? 'Next: Location Data' : 'Connect to Grid'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {authStep === 'location' && (
            <form onSubmit={handleLocationSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <button type="button" onClick={() => { setAuthStep('individual'); setPincodeError(""); }} className={`flex items-center gap-2 text-[10px] font-bold ${textMuted} hover:${textMain} uppercase tracking-widest mb-4 transition-colors`}>
                <ArrowLeft size={12} /> Back
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[10px] font-black ${textMain} uppercase tracking-wider mb-2`}>City</label>
                  <input type="text" required autoFocus value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bengaluru" className={`w-full border-2 ${borderMain} p-4 rounded-xl text-lg font-black text-red-600 ${bgBase} ${textMain} outline-none focus:border-red-600 transition-all`} />
                </div>
                <div>
                  <label className={`block text-[10px] font-black ${textMain} uppercase tracking-wider mb-2`}>Pincode</label>
                  <input type="text" required value={pincode} onChange={(e) => { setPincode(e.target.value); setPincodeError(""); }} placeholder="560001" className={`w-full border-2 p-4 rounded-xl text-lg font-black text-red-600 ${bgBase} ${textMain} outline-none transition-all tracking-[2px] ${pincodeError ? 'border-red-600 focus:ring-red-500/20' : `${borderMain} focus:border-red-600`}`} />
                  {pincodeError && <p className="text-red-600 text-[10px] font-black uppercase mt-2 tracking-widest animate-in slide-in-from-top-1">{pincodeError}</p>}
                </div>
              </div>
              <button type="submit" className={`w-full mt-2 ${inverseBg} ${inverseText} font-black text-sm uppercase tracking-widest p-5 rounded-xl hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2 group`}>
                Sync Local Grid <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2A: THE INDIVIDUAL DASHBOARD
  // ==========================================
  if (userType === 'individual') {
    return (
      <div className={`flex flex-col h-screen w-screen transition-colors duration-500 ${bgBase} ${textMain} overflow-hidden font-sans selection:bg-red-200 animate-in fade-in duration-500`}>

        {/* THE SLIDE-OUT MENU WITH SIDEBAR SEARCH */}
        {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMenuOpen(false)} />}
        <div className={`fixed inset-y-0 left-0 w-80 ${bgCard} border-r ${borderMain} shadow-2xl z-[120] transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
           <div className={`p-6 border-b ${borderMain} flex justify-between items-center ${bgBase}`}>
             <h2 className={`text-2xl font-black tracking-tight ${textMain} uppercase`}>Menu</h2>
             <button onClick={() => setIsMenuOpen(false)} className={`p-2 hover:bg-red-600 hover:text-white rounded-full transition-colors`}><X size={20}/></button>
           </div>

           {/* SIDEBAR SEARCH BAR */}
           <div className={`p-6 border-b ${borderMain}`}>
              <p className={`text-[10px] font-bold ${textMuted} uppercase tracking-widest mb-3`}>Global Node Search</p>
              <div className="relative">
                 <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                 <input
                   type="text"
                   placeholder="Search ID or Name..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className={`w-full pl-10 pr-4 py-3 rounded-xl border ${borderMain} ${bgBase} ${textMain} text-sm font-bold outline-none focus:border-red-500 transition-all placeholder:text-neutral-500`}
                 />
              </div>
           </div>

           <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
              <button onClick={() => { setActiveModal('donation'); setIsMenuOpen(false); }} className={`w-full text-left p-5 ${bgCard} rounded-2xl border-2 ${borderMain} ${isDark ? 'hover:border-white hover:bg-[#1a1a1a]' : 'hover:border-black hover:bg-neutral-50'} transition-all group`}>
                 <p className={`font-black text-sm ${textMain} uppercase tracking-wide flex items-center gap-2`}><Heart size={16} className="text-red-600"/> Blood Donation</p>
                 <p className={`text-[10px] font-bold ${textMuted} mt-2 uppercase tracking-widest group-hover:text-red-600 transition-colors`}>SAVE A LIFE</p>
              </button>
              <button onClick={() => { setActiveModal('credits'); setIsMenuOpen(false); }} className={`w-full text-left p-5 ${bgCard} rounded-2xl border-2 ${borderMain} ${isDark ? 'hover:border-white hover:bg-[#1a1a1a]' : 'hover:border-black hover:bg-neutral-50'} transition-all`}>
                 <p className={`font-black text-sm ${textMain} uppercase tracking-wide flex items-center gap-2`}><Award size={16} className={`${isDark ? 'text-white' : 'text-black'}`}/> Credits Earned</p>
              </button>
              <button onClick={() => { setActiveModal('settings'); setIsMenuOpen(false); }} className={`w-full text-left p-5 ${bgCard} rounded-2xl border-2 ${borderMain} ${isDark ? 'hover:border-white hover:bg-[#1a1a1a]' : 'hover:border-black hover:bg-neutral-50'} transition-all`}>
                 <p className={`font-black text-sm ${textMain} uppercase tracking-wide flex items-center gap-2`}><Settings size={16} className={`${isDark ? 'text-white' : 'text-black'}`}/> Settings</p>
              </button>
           </nav>
        </div>

        {/* GLOBAL POPUPS */}
        {activeModal === 'donation' && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${bgCard} border-2 ${borderMain} rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center animate-in zoom-in-95 duration-200`}>
              <button onClick={() => setActiveModal(null)} className={`absolute top-4 right-4 ${textMuted} hover:text-red-600`}><X /></button>
              <Heart size={40} className="text-red-600 mx-auto mb-4" />
              <h2 className={`text-2xl font-black uppercase tracking-tight ${textMain} mb-2`}>Blood Donation</h2>
              <p className={`${textMuted} text-xs font-bold uppercase tracking-widest mb-6`}>Save a Life Today</p>
              <div className={`p-4 rounded-xl border ${borderMain} mb-6 ${bgBase}`}>
                 <p className={`text-[10px] font-bold ${textMuted} uppercase mb-1`}>Nearest Donation Center</p>
                 <p className={`text-sm font-black ${textMain} uppercase`}>{displayedHospitals[0]?.name || "City Central Blood Bank"}</p>
                 <p className="text-[10px] font-bold text-red-600 uppercase mt-1">{displayedHospitals[0]?.simulatedDistance || "1.2"} KM Away</p>
              </div>
              <button onClick={() => setActiveModal('success')} className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">Donate Now</button>
            </div>
          </div>
        )}

        {activeModal === 'success' && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`${bgCard} border-2 border-red-600 rounded-3xl p-10 max-w-md w-full shadow-[0_0_40px_rgba(220,38,38,0.3)] relative text-center animate-in zoom-in-95 duration-300`}>
              <button onClick={() => setActiveModal(null)} className={`absolute top-4 right-4 ${textMuted} hover:text-red-600`}><X /></button>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"><Activity size={40} className="text-red-600" /></div>
              <h2 className={`text-3xl font-black uppercase tracking-tight ${textMain} mb-2`}>Congratulations!</h2>
              <p className="text-xl font-bold text-red-600 uppercase tracking-widest mb-8">50 Credits Earned</p>
              <button onClick={() => setActiveModal(null)} className={`w-full py-4 ${inverseBg} ${inverseText} font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-colors`}>Close</button>
            </div>
          </div>
        )}

        {activeModal === 'credits' && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${bgCard} border-2 ${borderMain} rounded-3xl p-10 max-w-sm w-full shadow-2xl relative text-center animate-in zoom-in-95 duration-200`}>
              <button onClick={() => setActiveModal(null)} className={`absolute top-4 right-4 ${textMuted} hover:text-red-600`}><X /></button>
              <Award size={40} className={`${textMain} mx-auto mb-4`} />
              <p className={`${textMuted} text-xs font-bold uppercase tracking-widest mb-4`}>Total Balance</p>
              <p className={`text-7xl font-black ${textMain} mb-2`}>150</p>
              <p className="text-sm font-bold text-red-600 uppercase tracking-widest mb-8">Available Credits</p>
              <button onClick={() => setActiveModal(null)} className={`w-full py-4 ${inverseBg} ${inverseText} font-black uppercase tracking-widest rounded-xl`}>Done</button>
            </div>
          </div>
        )}

        {/* SETTINGS POPUP - LIGHT/DARK THEME CHANGER */}
        {activeModal === 'settings' && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${bgCard} border-2 ${borderMain} rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center animate-in zoom-in-95 duration-200`}>
              <button onClick={() => setActiveModal(null)} className={`absolute top-4 right-4 ${textMuted} hover:text-red-600`}><X /></button>
              <Settings size={40} className={`${textMain} mx-auto mb-6`} />
              <h2 className={`text-2xl font-black uppercase tracking-tight ${textMain} mb-6`}>Settings</h2>
              <div className="space-y-4">
                 <button onClick={() => { setTheme('dark'); setActiveModal(null); }} className={`w-full py-4 flex items-center justify-center gap-3 bg-[#111] text-white font-black uppercase tracking-widest border border-neutral-800 rounded-xl hover:bg-black transition-colors`}><Moon size={18}/> Dark Mode</button>
                 <button onClick={() => { setTheme('light'); setActiveModal(null); }} className={`w-full py-4 flex items-center justify-center gap-3 bg-white text-black font-black uppercase tracking-widest border border-neutral-300 rounded-xl hover:bg-neutral-100 transition-colors`}><Sun size={18}/> Light Mode</button>
              </div>
            </div>
          </div>
        )}

        {/* MAP MODAL */}
        {activeModal === 'map' && (
          <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`${bgCard} border-2 border-red-600 rounded-3xl p-6 w-full max-w-7xl h-[90vh] shadow-[0_0_40px_rgba(220,38,38,0.2)] relative flex flex-col animate-in zoom-in-95 duration-300`}>
              <div className={`flex justify-between items-center mb-4 border-b ${borderMain} pb-4`}>
                 <div>
                   <h2 className={`text-2xl font-black uppercase tracking-tight ${textMain}`}>Live Global Mesh Network</h2>
                   <p className="text-xs font-bold text-red-600 mt-1 uppercase tracking-widest flex items-center gap-1"><Activity size={12}/> Geolocation Grid Active // Showing {hospitals.length} Nodes from CSV</p>
                 </div>
                 <button onClick={() => setActiveModal(null)} className={`p-2 hover:bg-red-600 hover:text-white rounded-full transition-colors`}><X size={24} className={textMain}/></button>
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden border border-neutral-200 relative">
                 <EmsDiversionMap hospitals={hospitals} predictions={predictions} selectedType={selectedType} />
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY VIEWER MODAL */}
        {selectedHospital && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`${bgCard} border-2 ${borderMain} rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200`}>
              <div className={`flex justify-between items-start mb-6 border-b ${borderMain} pb-4`}>
                 <div>
                   <h2 className={`text-2xl font-black uppercase tracking-tight ${textMain}`}>{selectedHospital.name}</h2>
                   <p className={`text-xs font-bold ${textMuted} mt-1 uppercase tracking-widest flex items-center gap-1`}><MapPin size={12}/> {selectedHospital.simulatedDistance} km away</p>
                 </div>
                 <button onClick={() => setSelectedHospital(null)} className={`p-2 hover:bg-red-600 hover:text-white rounded-full transition-colors`}><X size={24} className={textMain}/></button>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {['O_pos', 'O_neg', 'A_pos', 'A_neg', 'B_pos', 'B_neg', 'AB_pos', 'AB_neg'].map(bg => {
                  const stock = selectedHospital[bg] || 0;
                  const isLow = stock < 10;
                  return (
                    <div key={bg} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 ${isLow ? 'border-red-600/50 bg-red-600/10' : `${borderMain} ${bgBase}`}`}>
                      <span className={`text-xs font-black uppercase tracking-widest ${textMuted}`}>{bg.replace('_', ' ')}</span>
                      <span className={`text-2xl font-black ${isLow ? 'text-red-600' : textMain}`}>{stock}</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setSelectedHospital(null)} className={`w-full py-4 ${inverseBg} ${inverseText} font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-colors`}>Close Inventory</button>
            </div>
          </div>
        )}

        <header className={`${bgCard} border-b ${borderMain} px-10 py-5 shadow-sm relative z-50 flex justify-between items-center transition-colors`}>
           <div className="flex items-center gap-4">
             <button onClick={() => setIsMenuOpen(true)} className={`p-3 ${bgBase} hover:bg-red-600 hover:text-white rounded-xl transition-colors border ${borderMain}`}><Menu size={24} className={textMain} /></button>
             <div className="p-3 bg-red-600 text-white rounded-xl"><Activity size={24} /></div>
             <div>
               <h1 className={`text-2xl font-black ${textMain} tracking-tighter uppercase`}>BloodLink Patient Portal</h1>
               <p className={`text-[10px] font-bold ${textMuted} uppercase tracking-[3px] mt-1`}>Zone: {city} // Pin: {pincode}</p>
             </div>
           </div>

           <div className="relative">
              <button onClick={() => setShowProfile(!showProfile)} className={`flex items-center gap-3 ${bgBase} border ${borderMain} py-2 px-4 rounded-full ${rowHover} transition-colors`}>
                 <div className={`w-8 h-8 rounded-full ${inverseBg} flex items-center justify-center ${inverseText}`}><User size={16}/></div>
                 <div className="text-left hidden md:block"><p className={`text-xs font-black ${textMain} uppercase`}>ABHA Profile</p><p className={`text-[9px] font-bold ${textMuted}`}>{inputId}</p></div>
                 <ChevronDown size={16} className={textMuted}/>
              </button>
              {showProfile && (
                <div className={`absolute top-14 right-0 w-64 ${bgCard} border-2 ${borderMain} rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200`}>
                   <div className={`p-5 border-b ${borderMain}`}>
                     <p className={`text-[10px] font-bold ${textMuted} uppercase tracking-widest mb-4`}>Verified Identity</p>
                     <div className="space-y-3">
                       <div className="flex justify-between"><span className={`text-xs font-bold ${textMuted} uppercase`}>Name</span><span className={`text-xs font-black ${textMain}`}>[J. DOE]</span></div>
                       <div className="flex justify-between"><span className={`text-xs font-bold ${textMuted} uppercase`}>Age</span><span className={`text-xs font-black ${textMain}`}>[28]</span></div>
                       <div className="flex justify-between"><span className={`text-xs font-bold ${textMuted} uppercase`}>Blood</span><span className="text-xs font-black text-red-600">[O NEG]</span></div>
                       <div className="flex justify-between"><span className={`text-xs font-bold ${textMuted} uppercase`}>Sex</span><span className={`text-xs font-black ${textMain}`}>[MALE]</span></div>
                     </div>
                   </div>
                   <button onClick={handleLogout} className="w-full p-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors text-center">Logout Session</button>
                </div>
              )}
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 max-w-6xl mx-auto w-full">
          <div className="mb-10 flex justify-center">
            <div className={`${bgCard} border-2 ${borderMain} px-10 py-6 rounded-[2rem] shadow-xl text-center relative overflow-hidden group transition-colors`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60"></div>
              <h2 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter ${textMain}`}>48-Hour Predictive Blood Supply Grid</h2>
              <p className={`text-xs font-bold ${textMuted} mt-3 uppercase tracking-widest flex items-center justify-center gap-2`}><MapPin size={14} className="text-red-500"/> Showing top 10 secure nodes near {pincode}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-4 px-2">
             <div>
                <h3 className={`text-lg font-black uppercase tracking-tight ${textMain}`}>Local Node Directory</h3>
                <p className={`text-[10px] font-bold ${textMuted} uppercase tracking-widest mt-1`}>Click any row to view live inventory</p>
             </div>

             {/* --- FLOATING SEARCH BAR & MAP LAUNCHER (RIGHT SIDE) --- */}
             <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                   <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} />
                   <input
                     type="text"
                     placeholder="Search Name or ID..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className={`w-full pl-11 pr-4 py-3 ${inverseBg} ${inverseText} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'} rounded-2xl text-xs font-black outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:text-neutral-500`}
                   />
                   {searchQuery && (
                     <button onClick={() => setSearchQuery('')} className={`absolute right-4 top-1/2 -translate-y-1/2 ${textMuted} hover:text-red-500`}>
                       <X size={14} />
                     </button>
                   )}
                </div>

                <button onClick={() => setActiveModal('map')} className={`w-full md:w-auto ${inverseBg} ${inverseText} border ${isDark ? 'border-neutral-800' : 'border-neutral-200'} px-6 py-3 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 hover:shadow-red-500/20 transition-all shadow-md group`}>
                   <MapIcon size={18} className="text-red-500 group-hover:-translate-y-0.5 transition-transform" />
                   <span className="text-sm font-black uppercase tracking-[2px]">Launch Maps</span>
                </button>
             </div>
          </div>

          <div className="bg-white border-2 border-neutral-300 rounded-3xl overflow-hidden shadow-md mb-10">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-neutral-100 border-b-2 border-neutral-300">
                  <th className="p-5 text-xs font-black text-black uppercase tracking-widest w-16 text-center">#</th>
                  <th className="p-5 text-xs font-black text-black uppercase tracking-widest">Hospital Node</th>
                  <th className="p-5 text-xs font-black text-black uppercase tracking-widest text-center">Distance</th>
                  <th className="p-5 text-xs font-black text-black uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* NOW MAPS OVER THE DYNAMIC DISPLAYED HOSPITALS LIST */}
                {displayedHospitals.length > 0 ? displayedHospitals.map((h, index) => (
                  <tr key={h.id} onClick={() => setSelectedHospital(h)} className="border-b border-neutral-200 hover:bg-red-50 group cursor-pointer transition-colors">
                    <td className="p-5 text-sm font-black text-neutral-500 text-center group-hover:text-red-600">0{index + 1}</td>
                    <td className="p-5 text-sm font-black text-black uppercase tracking-wide group-hover:text-red-600">
                       {h.name} <span className="ml-2 text-[10px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">ID: {h.id}</span>
                    </td>
                    <td className="p-5 text-sm font-black text-neutral-600 text-center group-hover:text-black">{searchQuery ? 'Searched' : `${h.simulatedDistance} km`}</td>
                    <td className="p-5 text-right"><button className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg group-hover:bg-red-600 transition-colors">Check Stock</button></td>
                  </tr>
                )) : <tr><td colSpan="4" className="p-10 text-center text-red-600 font-black uppercase tracking-widest">No Node matches your search.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`${bgCard} border ${borderMain} p-8 rounded-3xl flex flex-col justify-center text-center shadow-sm transition-colors hover:border-red-500/30`}>
               <p className={`text-[11px] font-black ${textMuted} uppercase tracking-widest mb-2`}>Hospitals Connected</p>
               <p className={`text-5xl font-black ${textMain}`}>{hospitals.length}</p>
            </div>
            <div className={`${inverseBg} border ${isDark ? 'border-neutral-800' : 'border-black'} p-8 rounded-3xl flex flex-col justify-center text-center shadow-lg transition-colors`}>
               <p className={`text-[11px] font-black ${isDark ? 'text-neutral-500' : 'text-neutral-400'} uppercase tracking-widest mb-2`}>Accuracy of Predictions</p>
               <p className={`text-5xl font-black ${inverseText}`}>[89.4%]</p>
               <p className="text-[9px] font-bold text-red-500 mt-2 uppercase tracking-widest animate-pulse">Sci-Kit Engine Pending</p>
            </div>
            <div className="bg-red-600 border border-red-500 p-8 rounded-3xl flex flex-col justify-center text-center shadow-lg shadow-red-600/20">
               <p className="text-[11px] font-black text-white/70 uppercase tracking-widest mb-2">Blood Units Redistributed</p>
               <p className="text-5xl font-black text-white">[1,347]</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2B: THE ORGANIZATION DASHBOARD
  // (NOW FEATURES MANUAL TYPING INVENTORY MANAGEMENT!)
  // ==========================================

  const loggedInHospital = hospitals.find(h => h.id.toString() === inputId.toString());

  return (
    <div className={`flex h-screen w-screen ${bgBase} ${textMain} overflow-hidden font-sans selection:bg-red-200 animate-in fade-in duration-500`}>

      {/* THE SETTINGS POPUP (Available in Org Dashboard too!) */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${bgCard} border-2 ${borderMain} rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center animate-in zoom-in-95 duration-200`}>
            <button onClick={() => setActiveModal(null)} className={`absolute top-4 right-4 ${textMuted} hover:text-red-600`}><X /></button>
            <Settings size={40} className={`${textMain} mx-auto mb-6`} />
            <h2 className={`text-2xl font-black uppercase tracking-tight ${textMain} mb-6`}>Settings</h2>
            <div className="space-y-4">
               <button onClick={() => { setTheme('dark'); setActiveModal(null); }} className={`w-full py-4 flex items-center justify-center gap-3 bg-[#111] text-white font-black uppercase tracking-widest border border-neutral-800 rounded-xl hover:bg-black transition-colors`}><Moon size={18}/> Dark Mode</button>
               <button onClick={() => { setTheme('light'); setActiveModal(null); }} className={`w-full py-4 flex items-center justify-center gap-3 bg-white text-black font-black uppercase tracking-widest border border-neutral-300 rounded-xl hover:bg-neutral-100 transition-colors`}><Sun size={18}/> Light Mode</button>
            </div>
          </div>
        </div>
      )}

      <aside className={`w-[260px] ${bgCard} border-r ${borderMain} p-6 flex flex-col z-10 shadow-xl transition-colors`}>
        <div className={`flex items-center gap-3 mb-10 font-black text-2xl tracking-tight ${textMain}`}>
           <Activity size={28} className="text-red-600 animate-pulse" /> BloodLink.
        </div>
        <p className={`text-[10px] font-bold ${textMuted} mb-4 px-3 uppercase tracking-widest`}>Command Menu</p>
        <nav className="space-y-1 flex-1">
          <div className={`px-3 py-3 ${inverseBg} ${inverseText} rounded-xl text-sm font-bold flex items-center gap-3 cursor-pointer shadow-md`}>
             <LayoutGrid size={18}/> Dashboard
          </div>
          <div className={`px-3 py-3 ${textMuted} ${rowHover} rounded-xl text-sm font-bold flex items-center gap-3 cursor-pointer transition-colors`}>
             <Database size={18}/> Global Grid
          </div>

          {/* THE SETTINGS BUTTON FOR ORG DASHBOARD */}
          <div onClick={() => setActiveModal('settings')} className={`px-3 py-3 ${textMuted} ${rowHover} rounded-xl text-sm font-bold flex items-center gap-3 cursor-pointer transition-colors mt-2`}>
             <Settings size={18}/> Settings
          </div>
        </nav>
        <div className={`mt-auto p-4 border ${borderMain} ${bgBase} rounded-2xl shadow-sm`}>
           <p className={`text-xs font-bold ${textMain} mb-1 uppercase tracking-wider`}>Session Active</p>
           <p className={`text-[10px] ${textMuted} mb-1 font-mono`}>HOSP ID: {inputId}</p>
           <div className={`px-2 py-1.5 inline-flex rounded text-[10px] font-bold uppercase tracking-widest border ${isOnline ? `${bgCard} ${borderMain} ${textMain}` : 'bg-red-500/10 border-red-500/20 text-red-600'}`}>
             {isOnline ? '● GRID ONLINE' : '○ SYNCING'}
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`flex justify-between items-center ${bgCard} border-b ${borderMain} px-8 py-5 z-10 transition-colors`}>
           <div>
             <h1 className={`text-2xl font-black tracking-tight uppercase ${textMain}`}>Hospital Command Center</h1>
             <p className={`text-[10px] font-bold ${textMuted} uppercase tracking-[3px] mt-1`}>
               {loggedInHospital ? loggedInHospital.name : 'UNAUTHORIZED NODE'}
             </p>
           </div>
           <div className="flex items-center gap-6">
              <button onClick={handleLogout} className="px-6 py-2.5 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-600 text-xs font-black shadow-sm hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">
                Logout
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">

          {/* THE NEW LIVE INVENTORY MANAGEMENT PANEL (NOW WITH MANUAL TYPING) */}
          <div className={`mb-8 ${bgCard} border-2 ${borderMain} rounded-3xl p-6 shadow-sm`}>
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-red-100 rounded-lg"><Database size={20} className="text-red-600"/></div>
               <div>
                  <h3 className={`text-lg font-black uppercase tracking-tight ${textMain}`}>Live Inventory Control</h3>
                  <p className={`text-[10px] font-bold ${textMuted} uppercase tracking-widest`}>Type exact amounts or use controls to sync global mesh</p>
               </div>
            </div>

            {loggedInHospital ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                 {['O_pos', 'O_neg', 'A_pos', 'A_neg', 'B_pos', 'B_neg', 'AB_pos', 'AB_neg'].map(bg => {
                    const currentStock = loggedInHospital[bg] || 0;
                    const isLow = currentStock < 15;
                    return (
                      <div key={bg} className={`flex flex-col items-center p-4 border-2 rounded-2xl transition-colors ${isLow ? 'border-red-500 bg-red-500/10' : `${borderMain} ${bgBase}`}`}>
                         <span className={`text-[11px] font-black uppercase tracking-widest ${textMuted}`}>{bg.replace('_', ' ')}</span>

                         {/* THE DIRECT TEXT INPUT (Replaces the static span) */}
                         <input
                            type="text"
                            value={currentStock.toString()}
                            onChange={(e) => {
                               // Strips out any text/letters and leaves only numbers
                               const val = e.target.value.replace(/[^0-9]/g, '');
                               updateStockExact(loggedInHospital.id, bg, val === '' ? 0 : parseInt(val, 10));
                            }}
                            className={`w-full text-center bg-transparent outline-none text-3xl font-black my-2 ${isLow ? 'text-red-500 animate-pulse' : textMain}`}
                         />

                         <div className="flex w-full gap-2 mt-auto">
                            <button
                               onClick={() => updateStock(loggedInHospital.id, bg, -1)}
                               className={`flex-1 flex justify-center py-2 rounded-xl border ${borderMain} ${bgCard} hover:bg-red-600 hover:border-red-600 hover:text-white transition-all`}
                            ><Minus size={16}/></button>
                            <button
                               onClick={() => updateStock(loggedInHospital.id, bg, 1)}
                               className={`flex-1 flex justify-center py-2 rounded-xl border ${borderMain} ${bgCard} hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all`}
                            ><Plus size={16}/></button>
                         </div>
                      </div>
                    );
                 })}
              </div>
            ) : (
              <div className="p-10 text-center border-2 border-dashed border-red-500 rounded-2xl bg-red-500/10">
                 <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
                 <h3 className="text-xl font-black text-red-500 uppercase tracking-widest">ID Not Found In Database</h3>
                 <p className="text-xs font-bold text-red-500/70 mt-2 uppercase">Please log out and enter a valid 3-digit Hospital ID (e.g. 157, 158).</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-12 gap-6 h-[500px]">
             <div className={`col-span-12 ${bgCard} border ${borderMain} rounded-3xl p-2 shadow-sm relative h-full transition-colors`}>
               <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-sm border border-neutral-200 px-4 py-2 rounded-xl shadow-lg">
                  <span className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    Live Satellite Mesh
                  </span>
               </div>
               <div className={`w-full h-full rounded-2xl overflow-hidden border ${borderMain}`}>
                 <EmsDiversionMap hospitals={hospitals} predictions={predictions} selectedType={selectedType} />
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;