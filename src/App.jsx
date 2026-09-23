import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, MapPin, Calendar, User, Building2, ClipboardCheck,
  MoreVertical, Trash2, Pencil, Eye, Filter, X, Save, Hammer, ShieldCheck, Home,
  Factory, HardHat, Clock3, CheckCircle2, AlertTriangle, FileText, LayoutGrid, List, BarChart3, TrendingUp, Users, Video, Camera, ScanSearch, WifiOff
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts'

const TYPES = [
  { value: 'Construction', label: 'Construction', icon: HardHat, color: 'bg-amber-500' },
  { value: 'Property', label: 'Property', icon: Home, color: 'bg-blue-500' },
  { value: 'Safety', label: 'Safety', icon: ShieldCheck, color: 'bg-emerald-500' },
  { value: 'Industrial', label: 'Industrial', icon: Factory, color: 'bg-slate-700' },
  { value: 'Handover', label: 'Handover', icon: Building2, color: 'bg-violet-500' },
]

const STATUSES = [
  { value: 'Pending', label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: Clock3 },
  { value: 'In Progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500', icon: Hammer },
  { value: 'Completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
  { value: 'Issue Found', label: 'Issue Found', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500', icon: AlertTriangle },
]

const INCIDENT_STATUS = [
  { value: 'Open', label: 'Open', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  { value: 'In Review', label: 'In Review', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  { value: 'Resolved', label: 'Resolved', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  { value: 'Closed', label: 'Closed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
]
const SEVERITY = [
  { value: 'Low', label: 'Low', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'Medium', label: 'Medium', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'High', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'Critical', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' },
]

function genId(){ return Math.random().toString(36).slice(2,9) }

function generate80Sites(){
  const areas = ['Dubai Marina','Palm Jumeirah','Al Quoz','Downtown','Business Bay','JVC','Dubailand','Deira','Al Barsha','Sports City','JLT','Motor City','Arabian Ranches','Mirdif','AD - Corniche','Sharjah Ind','Ajman Free Zone','Ras Al Khaimah']
  const blocks = ['Block A','Block B','Tower A','Tower B','Plot 12','Plot 7','Unit 4B','Warehouse 7','Level 24','Phase 2','Gate 3','Zone C','Building 5','Complex 8']
  const types = ['Construction','Property','Safety','Industrial','Handover']
  const statuses = ['Pending','In Progress','Completed','Issue Found']
  const inspectors = ['Ahmed R.','Sarah M.','Khalid H.','Lisa K.','Omar S.','Priya N.','Youssef A.','Fatima K.','David L.','Noura H.']
  const notesPool = ['Rebar inspection + formwork check','Pre-handover snagging','Fire safety passed','Floor tolerance failed','CCTV alignment pending','ANPR calibration done','Cable tray inspection','Waterproofing check','HVAC duct leak','Safety harness audit']
  const items=[]
  for(let i=1;i<=80;i++){
    const area = areas[i % areas.length]
    const block = blocks[i % blocks.length]
    const type = types[i % types.length]
    const status = statuses[(i*7) % statuses.length]
    const inspector = inspectors[i % inspectors.length]
    const totalCameras = 12 + (i*7 % 36) // 12-47
    const offlineCameras = i % 10 === 0 ? 6 + (i % 4) : i % 5 === 0 ? 3 + (i % 3) : (i % 7 === 0 ? 1 : 0)
    const totalANPR = 2 + (i*3 % 8) // 2-9
    const offlineANPR = i % 12 === 0 ? 2 : i % 8 === 0 ? 1 : 0
    const notWorkingANPR = i % 15 === 0 ? 2 : i % 9 === 0 ? 1 : 0 // distinct from offline
    const notWorkingGate = i % 18 === 0 ? 2 : i % 11 === 0 ? 1 : 0
    const notWorkingIntercom = i % 20 === 0 ? 2 : i % 13 === 0 ? 1 : 0
    const day = String(10 + (i % 18)).padStart(2,'0')
    items.push({
      id: genId(),
      name: `Site ${String(i).padStart(2,'0')} — ${area} ${block}`,
      location: `${area}, ${block}`,
      type, status,
      date: `2026-09-${day}`,
      inspector,
      notes: notesPool[i % notesPool.length],
      totalCameras,
      offlineCameras: Math.min(offlineCameras, totalCameras),
      totalANPR,
      offlineANPR: Math.min(offlineANPR, totalANPR),
      notWorkingANPR: Math.min(notWorkingANPR, totalANPR),
      notWorkingGate: notWorkingGate,
      notWorkingIntercom: notWorkingIntercom,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop'
    })
  }
  return items
}
const SEED = generate80Sites()
const SEED_INCIDENTS = [
  { id: genId(), siteId: null, siteName: 'Marina Bay Tower - Level 24', title: 'Scaffold tie missing - North face L24', description: 'Scaffold tie at grid B-4 missing, movement observed in wind. Safety risk.', category: 'Safety', severity: 'High', status: 'Open', reportedBy: 'Ahmed R.', date: '2026-09-18', history: [{ at: '2026-09-18 10:30', by: 'Ahmed R.', change: 'Reported — High severity, Open' }, { at: '2026-09-19 09:15', by: 'Site Manager', change: 'Status → In Review, contractor notified' }] },
  { id: genId(), siteId: null, siteName: 'Palm Villas - Plot 12', title: 'AC duct leak - Master bedroom', description: 'Visible water stain, duct joint leaking. Needs HVAC rework before handover.', category: 'HVAC', severity: 'Medium', status: 'In Review', reportedBy: 'Sarah M.', date: '2026-09-22', history: [{ at: '2026-09-22 11:00', by: 'Sarah M.', change: 'Reported — Medium, Open' }, { at: '2026-09-22 14:20', by: 'Supervisor', change: 'Severity Medium → Medium, assigned to HVAC team' }] },
  { id: genId(), siteId: null, siteName: 'Downtown Retail - Unit 4B', title: 'Floor leveling failed 4mm', description: 'Measured deviation 4mm over 2m, exceeds tolerance 3mm. Re-screed required.', category: 'Finishing', severity: 'Critical', status: 'Open', reportedBy: 'Lisa K.', date: '2026-09-20', history: [{ at: '2026-09-20 16:45', by: 'Lisa K.', change: 'Reported — Critical, Open' }] },
]

function StatusBadge({ status }){
  const s = STATUSES.find(x=>x.value===status) || STATUSES[0]
  return <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color}`}><span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{status}</span>
}

const POWER_BI_COLORS = ['#0284c7','#ef4444','#7c3aed','#f59e0b','#0ea5e9','#1e293b','#06b6d4','#10b981']
const PROBLEM_CATS = ['Offline CCTV','Offline ANPR','Not Working ACS','Not Working Gate barrier','Not Working Intercom','Incident Sites']

// problems per site — maps to AMC categories: Offline CCTV / Offline ANPR / Not Working ACS / Gate barrier / Intercom / Incident Sites
function problemsForSite(site, idx, incidentsList){
  const out=[]
  if((site.offlineCameras||0)>0) out.push('Offline CCTV')
  if((site.offlineANPR||0)>0) out.push('Offline ANPR')
  if((site.notWorkingANPR||0)>0) out.push('Not Working ACS')
  if((site.notWorkingGate||0)>0) out.push('Not Working Gate barrier')
  if((site.notWorkingIntercom||0)>0) out.push('Not Working Intercom')
  const hasIncident = incidentsList ? incidentsList.some(inc=> inc.siteId===site.id && (inc.status==='Open' || inc.status==='In Review')) : false
  if(hasIncident || site.status==='Issue Found') out.push('Incident Sites')
  // fallback for sites with no AMC issues but status Issue Found still counts
  if(out.length===0 && site.status==='Issue Found') out.push('Incident Sites')
  return out
}

function PowerBICard({ title, subtitle, icon:Icon, action, children, className='' }){
  return (
    <div className={`bg-white rounded-xl border overflow-hidden flex flex-col ${className}`} style={{ borderColor:'#e2e8f0', boxShadow:'0 1px 2px rgba(0,0,0,0.04)' }}>
      <div className="px-4 py-3 flex items-center justify-between border-b bg-[#fcfcfd]" style={{ borderColor:'#eef2f7' }}>
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && <div className="w-7 h-7 rounded-lg bg-slate-900 text-white grid place-items-center shrink-0"><Icon size={14} /></div>}
          <div className="min-w-0">
            <div className="text-[13px] font-bold tracking-tight leading-none truncate">{title}</div>
            {subtitle && <div className="text-[11px] text-slate-500 truncate">{subtitle}</div>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-4 flex-1">{children}</div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }){
  if(!active || !payload || !payload.length) return null
  return (
    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
      <div className="font-semibold">{label || payload[0].name}</div>
      {payload.map((p,i)=><div key={i} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background:p.color||p.fill }} />{p.name}: <b>{p.value}</b></div>)}
    </div>
  )
}

export default function App(){
  const [sites, setSites] = useState(()=>{
    try{
      const saved = localStorage.getItem('site-inspection-sites-v80')
      if(saved){
        const parsed = JSON.parse(saved)
        if(Array.isArray(parsed) && parsed.length===80){
          // migrate missing fields for old 80
          const needs = parsed.some(s=> s.notWorkingANPR === undefined || s.notWorkingGate === undefined || s.notWorkingIntercom === undefined)
          if(needs){
            const fixed = parsed.map((s,i)=> ({ ...s, notWorkingANPR: s.notWorkingANPR ?? (i % 15===0 ? 2 : i%9===0 ? 1 : 0), notWorkingGate: s.notWorkingGate ?? (i % 18===0 ? 2 : i%11===0 ? 1 : 0), notWorkingIntercom: s.notWorkingIntercom ?? (i % 20===0 ? 2 : i%13===0 ? 1 : 0) }))
            setTimeout(()=> localStorage.setItem('site-inspection-sites-v80', JSON.stringify(fixed)), 0)
            return fixed
          }
          return parsed
        }
      }
      return SEED
    }catch{ return SEED }
  })
  const [incidents, setIncidents] = useState(()=>{
    try{
      const saved = localStorage.getItem('site-inspection-incidents')
      if(saved) return JSON.parse(saved)
      // link seed incidents to actual site ids
      const withIds = SEED_INCIDENTS.map((inc, i)=> ({ ...inc, siteId: SEED[i % SEED.length].id, siteName: SEED[i % SEED.length].name }))
      return withIds
    }catch{ return SEED_INCIDENTS }
  })
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [view, setView] = useState('grid') // grid | list
  const [page, setPage] = useState('sites') // sites | charts | attention | incidents | amc
  const [showAdd, setShowAdd] = useState(false)
  // incident page state
  const [incQuery, setIncQuery] = useState('')
  const [incStatusFilter, setIncStatusFilter] = useState('All')
  const [incSeverityFilter, setIncSeverityFilter] = useState('All')
  const [showIncident, setShowIncident] = useState(false)
  const [editingIncident, setEditingIncident] = useState(null)
  const [incForm, setIncForm] = useState({ siteId:'', title:'', description:'', category:'Safety', severity:'Medium', status:'Open', reportedBy:'', date: new Date().toISOString().slice(0,10) })
  const [viewHistory, setViewHistory] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name:'', location:'', type:'Construction', status:'Pending', date: new Date().toISOString().slice(0,10), inspector:'', notes:'', totalCameras: 0, offlineCameras: 0, totalANPR: 0, offlineANPR: 0, notWorkingANPR: 0, notWorkingGate: 0, notWorkingIntercom: 0 })
  const [amcFilter, setAmcFilter] = useState('all') // all | offlineCam | offlineANPR

  useEffect(()=>{ localStorage.setItem('site-inspection-sites-v80', JSON.stringify(sites)); localStorage.setItem('site-inspection-sites', JSON.stringify(sites)) }, [sites])
  useEffect(()=>{ localStorage.setItem('site-inspection-incidents', JSON.stringify(incidents)) }, [incidents])

  const filtered = useMemo(()=>{
    return sites.filter(s=>{
      const q = query.toLowerCase()
      const matchesQ = !q || s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.inspector.toLowerCase().includes(q)
      const matchesStatus = statusFilter==='All' || s.status===statusFilter
      const matchesType = typeFilter==='All' || s.type===typeFilter
      return matchesQ && matchesStatus && matchesType
    })
  }, [sites, query, statusFilter, typeFilter])

  const stats = useMemo(()=>{
    return {
      total: sites.length,
      pending: sites.filter(s=>s.status==='Pending').length,
      progress: sites.filter(s=>s.status==='In Progress').length,
      completed: sites.filter(s=>s.status==='Completed').length,
      issues: sites.filter(s=>s.status==='Issue Found').length,
    }
  }, [sites])

  // Charts data — Power BI style aggregations — categories: Offline CCTV / Offline ANPR / Not Working ACS / Gate barrier / Intercom / Incident Sites
  const chartData = useMemo(()=>{
    const byStatus = STATUSES.map(s=>({ name: s.label, value: sites.filter(x=>x.status===s.value).length, color: s.value==='Completed'?'#10b981':s.value==='In Progress'?'#2563eb':s.value==='Pending'?'#f59e0b':'#ef4444' })).filter(x=>x.value>0)
    const byType = TYPES.map(t=>({ name: t.label, value: sites.filter(x=>x.type===t.value).length })).filter(x=>x.value>0)
    const byInspectorMap = {}
    sites.forEach(s=>{ const k = s.inspector || 'Unassigned'; byInspectorMap[k]=(byInspectorMap[k]||0)+1 })
    const byInspector = Object.entries(byInspectorMap).map(([name,value])=>({ name, value, sites:value })).sort((a,b)=>b.value-a.value)
    const offlineCCTV = sites.filter(s=> (s.offlineCameras||0)>0).length
    const offlineANPR = sites.filter(s=> (s.offlineANPR||0)>0).length
    const notWorkingANPR = sites.filter(s=> (s.notWorkingANPR||0)>0).length
    const notWorkingGate = sites.filter(s=> (s.notWorkingGate||0)>0).length
    const notWorkingIntercom = sites.filter(s=> (s.notWorkingIntercom||0)>0).length
    const incidentSites = new Set([...sites.filter(s=>s.status==='Issue Found').map(s=>s.id), ...incidents.filter(i=> i.status==='Open' || i.status==='In Review').map(i=>i.siteId)]).size
    const byProblemCat = [
      { name: 'Offline CCTV', value: offlineCCTV, color: '#0284c7' },
      { name: 'Offline ANPR', value: offlineANPR, color: '#ef4444' },
      { name: 'Not Working ACS', value: notWorkingANPR, color: '#7c3aed' },
      { name: 'Not Working Gate barrier', value: notWorkingGate, color: '#0ea5e9' },
      { name: 'Not Working Intercom', value: notWorkingIntercom, color: '#1e293b' },
      { name: 'Incident Sites', value: incidentSites, color: '#f59e0b' },
    ].filter(x=> x.value>0)
    const totalProblems = offlineCCTV + offlineANPR + notWorkingANPR + incidentSites
    const monthKeys = ['Apr','May','Jun','Jul','Aug','Sep']
    const trend = monthKeys.map((m,mi)=>{
      const base = Math.max(1, Math.floor(sites.length/6))
      return { month: m, inspections: base + (mi%2), problems: Math.max(0, Math.floor(totalProblems/6) + (mi===5?2:0) + (mi%2)), completed: Math.floor(sites.filter(x=>x.status==='Completed').length/6)+mi%2 }
    })
    return { byStatus, byType, byInspector, byProblemCat, totalProblems, trend, offlineCCTV, offlineANPR, notWorkingANPR, incidentSites }
  }, [sites, incidents])

  // Attention Needed — sites that need action (Issue Found + open incidents + offline/not working)
  const attentionSites = useMemo(()=>{
    return sites.map((s, idx)=>{
      const probs = problemsForSite(s, idx, incidents)
      const relatedIncidents = incidents.filter(inc=> inc.siteId===s.id && (inc.status==='Open' || inc.status==='In Review'))
      const needs = s.status==='Issue Found' || relatedIncidents.length>0 || (probs.length>0 && s.status!=='Completed')
      if(!needs) return null
      return {
        site: s,
        problems: probs,
        incidents: relatedIncidents,
        reason: s.status==='Issue Found' ? 'Issue Found' : relatedIncidents.length>0 ? `${relatedIncidents.length} open incident(s)` : probs.join(' • '),
        severity: relatedIncidents.some(i=>i.severity==='Critical') || (s.offlineCameras||0)>4 || (s.notWorkingANPR||0)>1 ? 'Critical' : relatedIncidents.some(i=>i.severity==='High') || (s.offlineCameras||0)>0 ? 'High' : 'Medium'
      }
    }).filter(Boolean)
  }, [sites, incidents])

  // AMC Dashboard aggregations
  const amcStats = useMemo(()=>{
    const totalCameras = sites.reduce((a,s)=> a + (Number(s.totalCameras)||0), 0)
    const offlineCameras = sites.reduce((a,s)=> a + (Number(s.offlineCameras)||0), 0)
    const totalANPR = sites.reduce((a,s)=> a + (Number(s.totalANPR)||0), 0)
    const offlineANPR = sites.reduce((a,s)=> a + (Number(s.offlineANPR)||0), 0)
    const notWorkingANPR = sites.reduce((a,s)=> a + (Number(s.notWorkingANPR)||0), 0)
    const notWorkingGate = sites.reduce((a,s)=> a + (Number(s.notWorkingGate)||0), 0)
    const notWorkingIntercom = sites.reduce((a,s)=> a + (Number(s.notWorkingIntercom)||0), 0)
    const onlineCameras = Math.max(0, totalCameras - offlineCameras)
    const onlineANPR = Math.max(0, totalANPR - offlineANPR)
    const perSite = sites.map(s=>({
      name: s.name.length>18 ? s.name.slice(0,18)+'…' : s.name,
      fullName: s.name,
      totalCameras: Number(s.totalCameras)||0,
      offlineCameras: Number(s.offlineCameras)||0,
      onlineCameras: Math.max(0, (Number(s.totalCameras)||0) - (Number(s.offlineCameras)||0)),
      totalANPR: Number(s.totalANPR)||0,
      offlineANPR: Number(s.offlineANPR)||0,
      notWorkingANPR: Number(s.notWorkingANPR)||0,
      notWorkingGate: Number(s.notWorkingGate)||0,
      notWorkingIntercom: Number(s.notWorkingIntercom)||0,
      onlineANPR: Math.max(0, (Number(s.totalANPR)||0) - (Number(s.offlineANPR)||0)),
    }))
    return { totalCameras, offlineCameras, onlineCameras, totalANPR, offlineANPR, notWorkingANPR, notWorkingGate, notWorkingIntercom, onlineANPR, perSite,
      camOfflinePct: totalCameras ? Math.round((offlineCameras/totalCameras)*100) : 0,
      anprOfflinePct: totalANPR ? Math.round((offlineANPR/totalANPR)*100) : 0,
      notWorkingPct: totalANPR ? Math.round((notWorkingANPR/totalANPR)*100) : 0,
    }
  }, [sites])

  const openAdd = () => {
    setEditing(null)
    setForm({ name:'', location:'', type:'Construction', status:'Pending', date: new Date().toISOString().slice(0,10), inspector:'', notes:'', totalCameras: 0, offlineCameras: 0, totalANPR: 0, offlineANPR: 0, notWorkingANPR: 0, notWorkingGate: 0, notWorkingIntercom: 0 })
    setShowAdd(true)
  }
  const openEdit = (site) => {
    setEditing(site.id)
    setForm({ name: site.name, location: site.location, type: site.type, status: site.status, date: site.date, inspector: site.inspector, notes: site.notes, totalCameras: site.totalCameras||0, offlineCameras: site.offlineCameras||0, totalANPR: site.totalANPR||0, offlineANPR: site.offlineANPR||0, notWorkingANPR: site.notWorkingANPR||0, notWorkingGate: site.notWorkingGate||0, notWorkingIntercom: site.notWorkingIntercom||0 })
    setShowAdd(true)
  }
  const handleSave = (e) =>{
    e.preventDefault()
    if(!form.name.trim() || !form.location.trim()){ toast.error('Site name and location are required'); return }
    if(editing){
      setSites(prev=> prev.map(s=> s.id===editing ? { ...s, ...form } : s))
      toast.success('Site updated')
    } else {
      const newSite = { id: genId(), ...form, image: `https://images.unsplash.com/photo-${['1486406146926-c627a92ad1ab','1600596542815-ffad4c1539a9','1581091226825-a6a2a5aee158','1497366216548-37526070297c'][Math.floor(Math.random()*4)]}?w=600&h=400&fit=crop` }
      setSites(prev=>[newSite, ...prev])
      toast.success('Site added')
    }
    setShowAdd(false)
  }
  const handleDelete = (id) => {
    setSites(prev=> prev.filter(s=>s.id!==id))
    toast.success('Site deleted')
  }

  // Incident handlers
  const filteredIncidents = useMemo(()=>{
    return incidents.filter(r=>{
      const q = incQuery.toLowerCase()
      const matchesQ = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.siteName.toLowerCase().includes(q) || r.reportedBy.toLowerCase().includes(q)
      const matchesStatus = incStatusFilter==='All' || r.status===incStatusFilter
      const matchesSev = incSeverityFilter==='All' || r.severity===incSeverityFilter
      return matchesQ && matchesStatus && matchesSev
    })
  }, [incidents, incQuery, incStatusFilter, incSeverityFilter])

  const incidentStats = useMemo(()=>({
    total: incidents.length,
    open: incidents.filter(x=>x.status==='Open').length,
    review: incidents.filter(x=>x.status==='In Review').length,
    resolved: incidents.filter(x=>x.status==='Resolved').length,
    critical: incidents.filter(x=>x.severity==='Critical').length,
  }), [incidents])

  const openIncidentAdd = (prefillSiteId=null) => {
    setEditingIncident(null)
    const site = prefillSiteId ? sites.find(s=>s.id===prefillSiteId) : sites[0]
    setIncForm({ siteId: site?.id || sites[0]?.id || '', title:'', description:'', category:'Safety', severity:'Medium', status:'Open', reportedBy:'', date: new Date().toISOString().slice(0,10) })
    setShowIncident(true)
  }
  const openIncidentEdit = (inc) => {
    setEditingIncident(inc.id)
    setIncForm({ siteId: inc.siteId, title: inc.title, description: inc.description, category: inc.category, severity: inc.severity, status: inc.status, reportedBy: inc.reportedBy, date: inc.date })
    setShowIncident(true)
  }
  const handleIncidentSave = (e)=>{
    e.preventDefault()
    if(!incForm.title.trim() || !incForm.siteId){ toast.error('Site and title required'); return }
    const siteName = sites.find(s=>s.id===incForm.siteId)?.name || incForm.siteId
    const now = new Date().toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
    if(editingIncident){
      setIncidents(prev=> prev.map(r=>{
        if(r.id!==editingIncident) return r
        const prevStatus = r.status
        const prevSev = r.severity
        const changes = []
        if(prevStatus!==incForm.status) changes.push(`Status ${prevStatus} → ${incForm.status}`)
        if(prevSev!==incForm.severity) changes.push(`Severity ${prevSev} → ${incForm.severity}`)
        if(r.title!==incForm.title) changes.push(`Title changed`)
        if(r.description!==incForm.description) changes.push(`Description updated`)
        const historyEntry = changes.length ? { at: now, by: incForm.reportedBy || 'System', change: changes.join(' • ') } : null
        return { ...r, ...incForm, siteName, history: historyEntry ? [...r.history, historyEntry] : r.history }
      }))
      toast.success('Incident updated — change logged')
    } else {
      const newInc = { id: genId(), ...incForm, siteName, history: [{ at: now, by: incForm.reportedBy || 'System', change: `Reported — ${incForm.severity} severity, ${incForm.status}` }] }
      setIncidents(prev=>[newInc, ...prev])
      toast.success('Incident reported')
    }
    setShowIncident(false)
  }
  const handleIncidentDelete = (id)=>{ setIncidents(prev=>prev.filter(x=>x.id!==id)); toast.success('Incident deleted') }
  const updateIncidentStatus = (id, newStatus)=>{
    const now = new Date().toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
    setIncidents(prev=> prev.map(r=> r.id===id ? { ...r, status:newStatus, history:[...r.history, { at:now, by:'System', change:`Status ${r.status} → ${newStatus}` }] } : r))
    toast.success(`Status → ${newStatus}`)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Toaster richColors position="top-right" />

      {/* Header — highlighted heading on top, nav balanced at bottom */}
      <header className="sticky top-0 z-30 border-b overflow-hidden" style={{ borderColor: '#0f172a' }}>
        {/* Top row — heading centered & bigger, highlighted */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-900">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-[72px] flex items-center justify-between gap-4">
            <div className="h-12 px-3 rounded-xl bg-white grid place-items-center overflow-hidden shrink-0 shadow-lg ring-1 ring-white/20">
              <img
                src="/dhre-logo.svg"
                alt="DUBAI HOLDING REAL ESTATE"
                className="h-10 w-auto object-contain"
                onError={(e)=>{ e.currentTarget.src='/dhre-logo.jpg'; e.currentTarget.onerror=null }}
              />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="font-extrabold tracking-tight leading-none text-[24px] lg:text-[26px] text-white flex items-center gap-2">DHRE Security Dashboard <span className="hidden sm:inline-flex ml-1 px-2 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-bold tracking-widest border border-white/20">LIVE</span></div>
              <div className="text-xs lg:text-sm text-sky-200 mt-0.5">Security Operations</div>
            </div>
            <div className="w-11 lg:w-[140px] flex justify-end shrink-0">
              {page==='incidents' ? (
                <button onClick={()=>openIncidentAdd()} className="inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition shadow-lg ring-1 ring-white/20">
                  <FileText size={18} /> <span className="hidden lg:inline">Report Incident</span><span className="lg:hidden">Report</span>
                </button>
              ) : page==='sites' ? (
                <button onClick={openAdd} className="inline-flex items-center gap-2 px-3 lg:px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition shadow-lg">
                  <Plus size={18} /> <span className="hidden lg:inline">Add Site</span><span className="lg:hidden">Add</span>
                </button>
              ) : <span className="hidden lg:block w-[120px]" />}
            </div>
          </div>
        </div>
        {/* Bottom row — balanced nav under heading */}
        <div className="border-t bg-slate-50" style={{ borderColor: '#eef2f7' }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-[48px] flex items-center justify-center">
            <nav className="flex p-1 rounded-full bg-white border shadow-sm overflow-auto" style={{ borderColor:'#e2e8f0' }}>
              <button onClick={()=>setPage('sites')} className={`px-3 lg:px-5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 transition shrink-0 ${page==='sites'?'bg-slate-900 text-white shadow':'text-slate-600 hover:text-slate-900'}`}><LayoutGrid size={14} /> Sites</button>
              <button onClick={()=>setPage('charts')} className={`px-3 lg:px-5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 transition shrink-0 ${page==='charts'?'bg-[#f2c811] text-slate-900 shadow':'text-slate-600 hover:text-slate-900'}`}><BarChart3 size={14} /> Charts</button>
              <button onClick={()=>setPage('amc')} className={`px-3 lg:px-5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 transition shrink-0 ${page==='amc'?'bg-sky-600 text-white shadow':'text-slate-600 hover:text-slate-900'}`}><Video size={14} /> AMC</button>
              <button onClick={()=>setPage('attention')} className={`px-3 lg:px-5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 transition shrink-0 ${page==='attention'?'bg-red-600 text-white shadow':'text-slate-600 hover:text-slate-900'}`}><AlertTriangle size={12} /> Attention {attentionSites.length>0 && <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${page==='attention'?'bg-white text-red-600':'bg-red-100 text-red-700'}`}>{attentionSites.length}</span>}</button>
              <button onClick={()=>setPage('incidents')} className={`px-3 lg:px-5 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 transition shrink-0 ${page==='incidents'?'bg-slate-900 text-white shadow':'text-slate-600 hover:text-slate-900'}`}><FileText size={14} /> Reports</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* PAGE: SITES */}
        {page==='sites' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {[
                { label: 'Total Sites', value: stats.total, icon: Building2, color: 'bg-slate-900 text-white' },
                { label: 'Pending', value: stats.pending, icon: Clock3, color: 'bg-amber-500 text-white' },
                { label: 'In Progress', value: stats.progress, icon: Hammer, color: 'bg-blue-500 text-white' },
                { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'bg-emerald-500 text-white' },
              ].map(c=>(
                <div key={c.label} className="bg-white rounded-2xl border p-4 flex items-center gap-4" style={{ borderColor: '#e2e8f0' }}>
                  <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${c.color}`}><c.icon size={18} /></div>
                  <div><div className="text-2xl font-extrabold leading-none">{c.value}</div><div className="text-xs font-medium text-slate-500 mt-1">{c.label}</div></div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="mt-6 bg-white rounded-2xl border p-3 lg:p-4" style={{ borderColor: '#e2e8f0' }}>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by site name, location or inspector..." className="w-full pl-9 pr-3 py-2.5 rounded-full bg-slate-50 border text-sm outline-none focus:bg-white focus:border-slate-400" style={{ borderColor: '#e2e8f0' }} />
                </div>
                <div className="flex gap-2 overflow-auto">
                  <div className="relative">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="pl-8 pr-8 py-2.5 rounded-full bg-slate-50 border text-sm font-medium outline-none" style={{ borderColor: '#e2e8f0' }}>
                      <option value="All">All Status</option>
                      {STATUSES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="px-4 py-2.5 rounded-full bg-slate-50 border text-sm font-medium outline-none" style={{ borderColor: '#e2e8f0' }}>
                    <option value="All">All Types</option>
                    {TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <div className="flex p-1 rounded-full bg-slate-100 border" style={{ borderColor: '#e2e8f0' }}>
                    <button onClick={()=>setView('grid')} className={`w-8 h-8 grid place-items-center rounded-full ${view==='grid'?'bg-white shadow text-slate-900':'text-slate-500'}`}><LayoutGrid size={16} /></button>
                    <button onClick={()=>setView('list')} className={`w-8 h-8 grid place-items-center rounded-full ${view==='list'?'bg-white shadow text-slate-900':'text-slate-500'}`}><List size={16} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* List */}
            {filtered.length===0 ? (
              <div className="mt-8 bg-white rounded-[24px] border p-12 text-center" style={{ borderColor: '#e2e8f0' }}>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 grid place-items-center mx-auto text-slate-400"><Building2 size={24} /></div>
                <h3 className="mt-4 font-bold">No sites found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">Try adjusting filters or add your first site inspection.</p>
                <button onClick={openAdd} className="mt-5 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold inline-flex items-center gap-2"><Plus size={16} /> Add Site</button>
              </div>
            ) : view==='grid' ? (
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {filtered.map(site=>{
                  const t = TYPES.find(x=>x.value===site.type)
                  return (
                <motion.div key={site.id} layout initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="group bg-white rounded-[20px] border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition" style={{ borderColor: '#e2e8f0' }}>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full text-white ${t?.color || 'bg-slate-700'}`}><t.icon size={12} />{site.type}</span>
                      <StatusBadge status={site.status} />
                    </div>
                    <h3 className="font-bold leading-tight line-clamp-1">{site.name}</h3>
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} className="shrink-0" /><span className="truncate">{site.location}</span></div>
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border" style={{ borderColor: '#e2e8f0' }}><Calendar size={12} />{site.date}</span>
                          <span className="inline-flex items-center gap-1.5"><User size={12} />{site.inspector || 'Unassigned'}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                          <span className="px-2 py-1 rounded-full bg-slate-900 text-white font-bold flex items-center gap-1"><Camera size={11} />{site.totalCameras||0} Cam</span>
                          {(site.offlineCameras||0)>0 && <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 border font-bold" style={{ borderColor:'#fecaca' }}>{site.offlineCameras} offline CCTV</span>}
                          <span className="px-2 py-1 rounded-full bg-violet-600 text-white font-bold flex items-center gap-1"><ScanSearch size={11} />{site.totalANPR||0} ANPR</span>
                          {(site.offlineANPR||0)>0 && <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 border font-bold" style={{ borderColor:'#fde68a' }}>{site.offlineANPR} offline</span>}
                          {(site.notWorkingGate||0)>0 && <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 border font-bold" style={{ borderColor:'#bae6fd' }}>{site.notWorkingGate} Gate fail</span>}
                          {(site.notWorkingIntercom||0)>0 && <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 border font-bold" style={{ borderColor:'#e2e8f0' }}>{site.notWorkingIntercom} Intercom fail</span>}
                        </div>
                        {site.notes && <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-2 bg-slate-50 rounded-xl p-3 border" style={{ borderColor: '#eef2ff' }}>{site.notes}</p>}
                    <div className="mt-4 flex gap-2">
                      <button onClick={()=>openEdit(site)} className="flex-1 py-2 rounded-full border bg-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-slate-50" style={{ borderColor: '#e2e8f0' }}><Pencil size={14} /> Edit</button>
                      <button onClick={()=>handleDelete(site.id)} className="px-3 py-2 rounded-full border bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200" style={{ borderColor: '#e2e8f0' }}><Trash2 size={16} /></button>
                      <button onClick={()=>{ openIncidentAdd(site.id); setPage('incidents'); toast.info(`Reporting incident for ${site.name}`)}} className="px-3 py-2 rounded-full bg-red-600 text-white hover:bg-red-700" title="Report incident"><FileText size={16} /></button>
                    </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-6 bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs font-bold tracking-widest uppercase text-slate-500 border-b" style={{ borderColor: '#e2e8f0' }}>
                      <tr><th className="text-left px-4 py-3">Site</th><th className="text-left px-4 py-3 hidden lg:table-cell">Type</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3 hidden md:table-cell">Date</th><th className="text-left px-4 py-3 hidden md:table-cell">Inspector</th><th className="text-right px-4 py-3">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: '#f1f5f9' }}>
                      {filtered.map(s=>(
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3"><div className="font-semibold line-clamp-1">{s.name}</div><div className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10} />{s.location}</div></td>
                          <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 border" style={{ borderColor: '#e2e8f0' }}>{s.type}</span></td>
                          <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                          <td className="px-4 py-3 hidden md:table-cell text-slate-600">{s.date}</td>
                          <td className="px-4 py-3 hidden md:table-cell text-slate-600">{s.inspector || '-'}</td>
                          <td className="px-4 py-3 text-right"><div className="inline-flex gap-1"><button onClick={()=>openEdit(s)} className="w-8 h-8 grid place-items-center rounded-full border hover:bg-white" style={{ borderColor: '#e2e8f0' }}><Pencil size={14} /></button><button onClick={()=>handleDelete(s.id)} className="w-8 h-8 grid place-items-center rounded-full border hover:bg-red-50 hover:text-red-600" style={{ borderColor: '#e2e8f0' }}><Trash2 size={14} /></button></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* PAGE: CHARTS - Power BI style */}
        {page==='charts' && (
          <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f2c811] grid place-items-center"><BarChart3 size={16} className="text-slate-900" /></div>
              <div>
                <h2 className="text-[16px] font-extrabold tracking-tight leading-none">Charts</h2>
                <p className="text-xs text-slate-500">Power BI style analytics • Live from your sites</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-white border font-medium flex items-center gap-1.5" style={{ borderColor:'#e2e8f0' }}><span className="w-2 h-2 rounded-full bg-emerald-500" /> {chartData.totalProblems} problems tracked</span>
              <span className="px-3 py-1.5 rounded-full bg-white border font-medium" style={{ borderColor:'#e2e8f0' }}>{sites.length} sites • {chartData.byInspector.length} inspectors</span>
            </div>
          </div>

          {/* KPI Row - Power BI cards — Total Sites chart + Attention Needed clickable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
            {/* Total Sites — chart (not just number) */}
            <div className="bg-white rounded-xl border p-4 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
              <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500 flex items-center justify-between">Total Sites <span className="w-6 h-6 rounded-lg bg-slate-900 text-white grid place-items-center"><Building2 size={12} /></span></div>
              <div className="mt-1 flex items-baseline gap-2"><span className="text-3xl font-extrabold">{stats.total}</span><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 border" style={{ borderColor:'#e2e8f0' }}>{stats.total} sites</span></div>
              {/* Power BI style stacked bar inside card — total sites chart */}
              <div className="mt-3 h-2 w-full rounded-full overflow-hidden flex bg-slate-100">
                {chartData.byStatus.map(s=> <div key={s.name} className="h-full" style={{ width:`${(s.value/stats.total)*100}%`, background: s.color }} title={`${s.name}: ${s.value}`} />)}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                {chartData.byStatus.map(s=> <span key={s.name} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name} {s.value}</span>)}
              </div>
            </div>

            {/* Attention Needed — CLICKABLE to attention page */}
            <button onClick={()=>setPage('attention')} className="text-left bg-white rounded-xl border p-4 relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition group" style={{ borderColor:'#e2e8f0' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold tracking-widest uppercase text-red-600">Attention Needed</div>
                <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-red-600 text-white group-hover:bg-red-700">View →</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2"><span className="text-3xl font-extrabold text-red-600">{attentionSites.length}</span><span className={`text-xs font-bold px-1.5 py-0.5 rounded ${attentionSites.length>0?'bg-red-50 text-red-600 border border-red-200':'bg-emerald-50 text-emerald-600'}`}>{attentionSites.length===0?'All clear':attentionSites.length>2?'Action required':'Review'}</span></div>
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5"><AlertTriangle size={12} className="text-red-500" /> {attentionSites.length===0 ? 'No sites need attention' : `${attentionSites.filter(a=>a.severity==='Critical').length} critical • Tap to see sites + problems`}</div>
              <div className="mt-2 flex gap-1">
                {attentionSites.slice(0,4).map(a=> <span key={a.site.id} className="w-6 h-6 rounded-full bg-slate-900 text-white grid place-items-center text-[10px] font-bold" title={a.site.name}>{a.site.name[0]}</span>)}
                {attentionSites.length>4 && <span className="w-6 h-6 rounded-full bg-slate-100 border grid place-items-center text-[10px] font-bold" style={{ borderColor:'#e2e8f0' }}>+{attentionSites.length-4}</span>}
              </div>
            </button>

            <div className="bg-white rounded-xl border p-4 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-[#2563eb]" />
              <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Total Problems</div>
              <div className="mt-1 flex items-baseline gap-2"><span className="text-3xl font-extrabold">{chartData.totalProblems}</span><span className={`text-xs font-bold px-1.5 py-0.5 rounded ${chartData.totalProblems>0?'bg-red-50 text-red-600':'bg-emerald-50 text-emerald-600'}`}>{chartData.totalProblems>5?'High':'Low'}</span></div>
              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1"><TrendingUp size={12} /> Across all sites</div>
            </div>
            <div className="bg-white rounded-xl border p-4 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-[#10b981]" />
              <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Completion Rate</div>
              <div className="mt-1 text-3xl font-extrabold">{sites.length ? Math.round((stats.completed/sites.length)*100) : 0}%</div>
              <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width:`${sites.length?Math.round((stats.completed/sites.length)*100):0}%` }} /></div>
            </div>
          </div>

          {/* Main Charts Grid - 2x2 Power BI */}
          <div className="grid lg:grid-cols-12 gap-4">
            {/* Problems by Category — Bar (Power BI column) */}
            <PowerBICard title="Problems by Category" subtitle={`${chartData.totalProblems} total • Top: ${chartData.byProblemCat[0]?.name || '—'} (${chartData.byProblemCat[0]?.value || 0})`} icon={AlertTriangle} className="lg:col-span-8 min-h-[340px]">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData.byProblemCat} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" name="Problems" radius={[6,6,0,0]} barSize={28}>
                    {chartData.byProblemCat.map((e,i)=><Cell key={i} fill={POWER_BI_COLORS[i % POWER_BI_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {chartData.byProblemCat.map((c,i)=><span key={c.name} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border" style={{ borderColor:'#eef2f7' }}><span className="w-2 h-2 rounded-full" style={{ background:POWER_BI_COLORS[i%POWER_BI_COLORS.length] }} />{c.name} • {c.value}</span>)}
              </div>
            </PowerBICard>

            {/* Sites by Status — Donut (Power BI donut) */}
            <PowerBICard title="Sites by Status" subtitle="Distribution" icon={ClipboardCheck} className="lg:col-span-4 min-h-[340px]">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={chartData.byStatus} cx="50%" cy="50%" innerRadius={56} outerRadius={78} paddingAngle={3} dataKey="value" strokeWidth={2} stroke="#fff">
                    {chartData.byStatus.map((e,i)=><Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 -mt-1">
                {chartData.byStatus.map(s=>(
                  <div key={s.name} className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-slate-50 border text-xs font-medium" style={{ borderColor:'#eef2f7' }}>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background:s.color }} />{s.name}</span><b>{s.value}</b>
                  </div>
                ))}
              </div>
            </PowerBICard>

            {/* Assigned Sites per Inspector — Horizontal Bar (Power BI bar) */}
            <PowerBICard title="Assigned Sites per Person" subtitle="Workload distribution" icon={Users} action={<span className="text-[11px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{chartData.byInspector.length} people</span>} className="lg:col-span-7 min-h-[360px]">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData.byInspector} layout="vertical" margin={{ top: 4, right: 16, left: 12, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill:'#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill:'#0f172a', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill:'#f8fafc' }} />
                  <Bar dataKey="value" name="Sites" radius={[0,8,8,0]} barSize={18}>
                    {chartData.byInspector.map((_,i)=><Cell key={i} fill={POWER_BI_COLORS[i % POWER_BI_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </PowerBICard>

            {/* Sites by Type — Donut + Table style */}
            <PowerBICard title="Sites by Type" subtitle="Inspection categories" icon={Building2} className="lg:col-span-5 min-h-[360px]">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={chartData.byType} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={2} dataKey="value" strokeWidth={2} stroke="#fff">
                    {chartData.byType.map((_,i)=><Cell key={i} fill={POWER_BI_COLORS[i % POWER_BI_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {chartData.byType.map((c,i)=>{
                  const pct = sites.length ? Math.round((c.value/sites.length)*100) : 0
                  return (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background:POWER_BI_COLORS[i%POWER_BI_COLORS.length] }} />
                      <span className="text-xs font-semibold flex-1">{c.name}</span>
                      <span className="text-xs font-bold">{c.value}</span>
                      <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width:`${pct}%`, background:POWER_BI_COLORS[i%POWER_BI_COLORS.length] }} /></div>
                    </div>
                  )
                })}
              </div>
            </PowerBICard>

            {/* Trend — Area (Power BI line/area) full width */}
            <PowerBICard title="Trend — Inspections & Problems" subtitle="Last 6 months • Apr — Sep 2026" icon={TrendingUp} className="lg:col-span-12">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData.trend} margin={{ top: 6, right: 12, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gIns" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.22} /><stop offset="100%" stopColor="#2563eb" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gProb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.18} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill:'#64748b', fontWeight:600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill:'#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="inspections" name="Inspections" stroke="#2563eb" strokeWidth={2.5} fill="url(#gIns)" dot={{ r:3 }} />
                  <Area type="monotone" dataKey="problems" name="Problems" stroke="#ef4444" strokeWidth={2} fill="url(#gProb)" dot={{ r:3 }} />
                  <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} fillOpacity={0} dot={{ r:3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </PowerBICard>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#f2c811]" /> Power BI style • Updates live when you Add/Edit sites • Data reflects all sites
          </div>
        </div>
        )}

        {/* PAGE: INCIDENTS - Incident Reports with Change History */}
        {page==='incidents' && (
          <div className="mt-2">
            {/* KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              <div className="bg-white rounded-xl border p-3 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}><div className="absolute top-0 left-0 w-full h-1 bg-slate-900" /><div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Total Reports</div><div className="text-2xl font-extrabold mt-1">{incidentStats.total}</div><div className="text-xs text-slate-500">{incidentStats.open} open</div></div>
              <div className="bg-white rounded-xl border p-3 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}><div className="absolute top-0 left-0 w-full h-1 bg-red-500" /><div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Open</div><div className="text-2xl font-extrabold mt-1">{incidentStats.open}</div><div className="text-xs text-slate-500">needs action</div></div>
              <div className="bg-white rounded-xl border p-3 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}><div className="absolute top-0 left-0 w-full h-1 bg-amber-500" /><div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">In Review</div><div className="text-2xl font-extrabold mt-1">{incidentStats.review}</div><div className="text-xs text-slate-500">under review</div></div>
              <div className="bg-white rounded-xl border p-3 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}><div className="absolute top-0 left-0 w-full h-1 bg-blue-500" /><div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Resolved</div><div className="text-2xl font-extrabold mt-1">{incidentStats.resolved}</div><div className="text-xs text-slate-500">fixed</div></div>
              <div className="bg-white rounded-xl border p-3 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}><div className="absolute top-0 left-0 w-full h-1 bg-red-700" /><div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Critical</div><div className="text-2xl font-extrabold mt-1 text-red-600">{incidentStats.critical}</div><div className="text-xs text-slate-500">high priority</div></div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border p-3 flex flex-col lg:flex-row gap-3 mb-4" style={{ borderColor:'#e2e8f0' }}>
              <div className="flex-1 relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={incQuery} onChange={e=>setIncQuery(e.target.value)} placeholder="Search reports by title, site, description..." className="w-full pl-9 pr-3 py-2.5 rounded-full bg-slate-50 border text-sm outline-none focus:bg-white" style={{ borderColor:'#e2e8f0' }} />
              </div>
              <select value={incStatusFilter} onChange={e=>setIncStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-full bg-slate-50 border text-sm font-medium" style={{ borderColor:'#e2e8f0' }}>
                <option value="All">All Status</option>
                {INCIDENT_STATUS.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <select value={incSeverityFilter} onChange={e=>setIncSeverityFilter(e.target.value)} className="px-3 py-2.5 rounded-full bg-slate-50 border text-sm font-medium" style={{ borderColor:'#e2e8f0' }}>
                <option value="All">All Severity</option>
                {SEVERITY.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <select onChange={e=>{ if(e.target.value) openIncidentAdd(e.target.value); e.target.value='' }} className="px-3 py-2.5 rounded-full bg-white border text-sm font-medium hidden lg:block" style={{ borderColor:'#e2e8f0' }}>
                <option value="">Quick: Report for site...</option>
                {sites.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            {/* Incident Cards */}
            {filteredIncidents.length===0 ? (
              <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor:'#e2e8f0' }}>
                <div className="w-12 h-12 rounded-xl bg-slate-100 grid place-items-center mx-auto text-slate-400"><FileText size={20} /></div>
                <h3 className="mt-3 font-bold">No incident reports</h3>
                <p className="text-sm text-slate-500 mt-1">Report an incident for any site — changes are tracked automatically.</p>
                <button onClick={()=>openIncidentAdd()} className="mt-4 px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-bold inline-flex items-center gap-2"><Plus size={16} /> Report Incident</button>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredIncidents.map(inc=>{
                  const sev = SEVERITY.find(x=>x.value===inc.severity)
                  const st = INCIDENT_STATUS.find(x=>x.value===inc.status)
                  return (
                    <div key={inc.id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition" style={{ borderColor:'#e2e8f0' }}>
                      <div className="p-4 flex gap-4">
                        <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 text-white ${inc.severity==='Critical'?'bg-red-600':inc.severity==='High'?'bg-orange-500':inc.severity==='Medium'?'bg-amber-500':'bg-slate-500'}`}><AlertTriangle size={18} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-bold leading-tight truncate pr-2">{inc.title}</h3>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border font-medium" style={{ borderColor:'#e2e8f0' }}><Building2 size={10} />{inc.siteName}</span>
                                <span className={`px-2 py-1 rounded-full border font-bold text-xs ${sev.color}`}>{inc.severity}</span>
                                <span className={`px-2 py-1 rounded-full border font-bold text-xs flex items-center gap-1 ${st.color}`}><span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{inc.status}</span>
                                <span className="px-2 py-1 rounded-full bg-slate-100 border text-xs font-medium" style={{ borderColor:'#e2e8f0' }}>{inc.category}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={()=>setViewHistory(inc)} className="px-3 py-1.5 rounded-full border bg-white text-xs font-semibold flex items-center gap-1 hover:bg-slate-50" style={{ borderColor:'#e2e8f0' }}><Clock3 size={12} /> History ({inc.history.length})</button>
                              <button onClick={()=>openIncidentEdit(inc)} className="w-8 h-8 grid place-items-center rounded-full border hover:bg-slate-50" style={{ borderColor:'#e2e8f0' }}><Pencil size={14} /></button>
                              <button onClick={()=>handleIncidentDelete(inc.id)} className="w-8 h-8 grid place-items-center rounded-full border hover:bg-red-50 hover:text-red-600" style={{ borderColor:'#e2e8f0' }}><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3 border" style={{ borderColor:'#eef2f7' }}>{inc.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Calendar size={12} />{inc.date}</span>
                            <span className="flex items-center gap-1"><User size={12} />{inc.reportedBy || '—'}</span>
                            <span className="ml-auto flex gap-1">
                              {INCIDENT_STATUS.map(s=>(
                                <button key={s.value} onClick={()=>updateIncidentStatus(inc.id, s.value)} className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${inc.status===s.value ? s.color + ' border-current' : 'bg-white hover:bg-slate-50'}`} style={{ borderColor: inc.status===s.value? undefined : '#e2e8f0' }}>{s.label}</button>
                              ))}
                            </span>
                          </div>
                          {inc.history.length>0 && (
                            <div className="mt-3 pl-3 border-l-2 border-slate-100 space-y-1">
                              {inc.history.slice(-2).map((h,i)=>(
                                <div key={i} className="text-xs flex gap-2"><span className="text-slate-400 shrink-0">{h.at}</span><span className="font-medium text-slate-700">{h.by}:</span><span className="text-slate-600 truncate">{h.change}</span></div>
                              ))}
                              {inc.history.length>2 && <button onClick={()=>setViewHistory(inc)} className="text-xs font-semibold text-slate-900 underline">View all {inc.history.length} changes →</button>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* PAGE: ATTENTION - Sites that need attention with problems */}
        {page==='attention' && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600 grid place-items-center text-white"><AlertTriangle size={16} /></div>
                <div>
                  <h2 className="text-[16px] font-extrabold tracking-tight leading-none">Attention Needed</h2>
                  <p className="text-xs text-slate-500">{attentionSites.length} site{attentionSites.length!==1?'s':''} require action • Click any to jump to report</p>
                </div>
              </div>
              <button onClick={()=>setPage('charts')} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border text-xs font-semibold hover:bg-slate-50" style={{ borderColor:'#e2e8f0' }}><BarChart3 size={12} /> Back to Charts</button>
            </div>

            {attentionSites.length===0 ? (
              <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor:'#e2e8f0' }}>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center mx-auto"><CheckCircle2 size={20} /></div>
                <h3 className="mt-3 font-bold">All clear — no attention needed</h3>
                <p className="text-sm text-slate-500 mt-1">Every site is completed or has no open problems/incidents.</p>
                <button onClick={()=>setPage('sites')} className="mt-4 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-bold">Go to Sites</button>
              </div>
            ) : (
              <div className="grid gap-4">
                {attentionSites.map(({ site, problems, incidents: siteIncidents, reason, severity })=>{
                  const t = TYPES.find(x=>x.value===site.type)
                  return (
                    <div key={site.id} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: severity==='Critical' ? '#fecaca' : '#e2e8f0', boxShadow: severity==='Critical' ? '0 0 0 1px #fecaca' : '' }}>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 text-white ${t?.color || 'bg-slate-700'}`}><t.icon size={18} /></div>
                            <div className="min-w-0">
                              <h3 className="font-bold leading-tight">{site.name}</h3>
                              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5"><MapPin size={12} />{site.location} <span className="hidden sm:inline">•</span> <span className="inline-flex items-center gap-1"><User size={11} />{site.inspector || 'Unassigned'}</span></div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <StatusBadge status={site.status} />
                                <span className={`px-2 py-1 rounded-full border text-xs font-bold ${severity==='Critical'?'bg-red-600 text-white border-red-600':severity==='High'?'bg-orange-500 text-white border-orange-500':'bg-amber-100 text-amber-700 border-amber-200'}`}>{severity} attention</span>
                                <span className="px-2 py-1 rounded-full bg-slate-50 border text-xs font-medium" style={{ borderColor:'#e2e8f0' }}>{reason}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={()=>{ setPage('sites'); setTimeout(()=>document.getElementById(`site-${site.id}`)?.scrollIntoView({ behavior:'smooth', block:'center' }), 100)}} className="px-3 py-1.5 rounded-full bg-white border text-xs font-semibold hover:bg-slate-50" style={{ borderColor:'#e2e8f0' }}><Eye size={12} /> Site</button>
                            <button onClick={()=>{ setPage('incidents'); toast.info(`Filtered incidents for ${site.name}`)}} className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-black"><FileText size={12} /> Reports ({siteIncidents.length})</button>
                          </div>
                        </div>

                        {/* Problems needed */}
                        <div className="mt-4 grid md:grid-cols-2 gap-3">
                          <div className="rounded-xl border bg-amber-50/60 p-3" style={{ borderColor:'#fde68a' }}>
                            <div className="text-xs font-bold tracking-widest uppercase text-amber-800 flex items-center gap-1.5"><AlertTriangle size={12} /> Problems on site ({problems.length})</div>
                            {problems.length===0 ? <div className="text-xs text-slate-500 mt-2">No auto-detected problems — check incidents.</div> : (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {problems.map((p,i)=> <span key={i} className="px-2 py-1 rounded-full bg-white border text-xs font-semibold" style={{ borderColor:'#fde68a' }}>{p}</span>)}
                              </div>
                            )}
                            {site.notes && <div className="mt-2 text-xs text-slate-700 bg-white rounded-lg p-2 border" style={{ borderColor:'#fde68a' }}><b>Note:</b> {site.notes}</div>}
                          </div>
                          <div className="rounded-xl border bg-red-50/60 p-3" style={{ borderColor:'#fecaca' }}>
                            <div className="text-xs font-bold tracking-widest uppercase text-red-700 flex items-center gap-1.5"><FileText size={12} /> Open incidents ({siteIncidents.length})</div>
                            {siteIncidents.length===0 ? <div className="text-xs text-slate-500 mt-2">No open incidents — but status indicates attention.</div> : (
                              <div className="mt-2 space-y-2">
                                {siteIncidents.map(inc=>(
                                  <div key={inc.id} className="bg-white rounded-lg border p-2.5" style={{ borderColor:'#fecaca' }}>
                                    <div className="text-xs font-bold leading-tight">{inc.title}</div>
                                    <div className="text-xs text-slate-600 line-clamp-2 mt-0.5">{inc.description}</div>
                                    <div className="mt-1.5 flex gap-1 flex-wrap">
                                      <span className={`px-1.5 py-0.5 rounded-full border text-[11px] font-bold ${inc.severity==='Critical'?'bg-red-600 text-white':inc.severity==='High'?'bg-orange-100 text-orange-700 border-orange-200':'bg-slate-100'}`}>{inc.severity}</span>
                                      <span className="px-1.5 py-0.5 rounded-full bg-slate-50 border text-[11px] font-medium" style={{ borderColor:'#e2e8f0' }}>{inc.category}</span>
                                      <span className="text-[11px] text-slate-500 ml-auto">{inc.date}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* PAGE: AMC — AMC Site Report Dashboard */}
        {page==='amc' && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 grid place-items-center text-white"><Video size={16} /></div>
                <div>
                  <h2 className="text-[16px] font-extrabold tracking-tight leading-none">AMC Site Report</h2>
                  <p className="text-xs text-slate-500">Annual Maintenance Contract • Cameras & ANPR • Live from sites</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <button onClick={()=>setPage('sites')} className="px-3 py-1.5 rounded-full bg-white border text-xs font-semibold hover:bg-slate-50" style={{ borderColor:'#e2e8f0' }}>Edit sites →</button>
              </div>
            </div>

            {/* AMC KPI Row — 4 main + 2 rates */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div className="bg-white rounded-xl border p-4 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-sky-600" />
                <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500 flex items-center justify-between">Total Cameras <Camera size={12} className="text-sky-600" /></div>
                <div className="mt-1 text-3xl font-extrabold">{amcStats.totalCameras}</div>
                <div className="mt-1 text-xs text-slate-500">{amcStats.onlineCameras} online • {amcStats.offlineCameras} offline</div>
                <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex"><div className="h-full bg-sky-600" style={{ width: `${amcStats.totalCameras ? (amcStats.onlineCameras/amcStats.totalCameras)*100 : 0}%` }} /><div className="h-full bg-red-500" style={{ width: `${amcStats.totalCameras ? (amcStats.offlineCameras/amcStats.totalCameras)*100 : 0}%` }} /></div>
              </div>
              <button onClick={()=> setAmcFilter(amcFilter==='offlineCam' ? 'all' : 'offlineCam')} className={`text-left bg-white rounded-xl border p-4 relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition w-full ${amcFilter==='offlineCam' ? 'ring-2 ring-red-500 border-red-300' : ''}`} style={{ borderColor: amcFilter==='offlineCam' ? '#fca5a5' : amcStats.offlineCameras>0 ? '#fecaca' : '#e2e8f0' }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
                <div className="text-[11px] font-bold tracking-widest uppercase text-red-600 flex items-center justify-between">Offline Cameras <WifiOff size={12} /> {amcFilter==='offlineCam' && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded-full">Filtered</span>}</div>
                <div className="mt-1 text-3xl font-extrabold text-red-600">{amcStats.offlineCameras}</div>
                <div className="mt-1 text-xs font-bold"><span className={`px-1.5 py-0.5 rounded ${amcStats.camOfflinePct>10?'bg-red-100 text-red-700':'bg-emerald-50 text-emerald-700'}`}>{amcStats.camOfflinePct}% offline</span> <span className="text-slate-500 font-normal ml-1">of {amcStats.totalCameras}</span></div>
                <div className="mt-2 text-[11px] font-semibold text-red-600 flex items-center gap-1">{amcFilter==='offlineCam' ? 'Showing offline only • Click to show all' : 'Click to show sites with offline →'}</div>
              </button>
              <div className="bg-white rounded-xl border p-4 relative overflow-hidden" style={{ borderColor:'#e2e8f0' }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-violet-600" />
                <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500 flex items-center justify-between">Total ANPR <ScanSearch size={12} className="text-violet-600" /></div>
                <div className="mt-1 text-3xl font-extrabold">{amcStats.totalANPR}</div>
                <div className="mt-1 text-xs text-slate-500">{amcStats.onlineANPR} online • {amcStats.offlineANPR} offline</div>
                <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex"><div className="h-full bg-violet-600" style={{ width: `${amcStats.totalANPR ? (amcStats.onlineANPR/amcStats.totalANPR)*100 : 0}%` }} /><div className="h-full bg-amber-500" style={{ width: `${amcStats.totalANPR ? (amcStats.offlineANPR/amcStats.totalANPR)*100 : 0}%` }} /></div>
              </div>
              <button onClick={()=> setAmcFilter(amcFilter==='offlineANPR' ? 'all' : 'offlineANPR')} className={`text-left bg-white rounded-xl border p-4 relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition w-full ${amcFilter==='offlineANPR' ? 'ring-2 ring-amber-500 border-amber-300' : ''}`} style={{ borderColor: amcFilter==='offlineANPR' ? '#fcd34d' : amcStats.offlineANPR>0 ? '#fde68a' : '#e2e8f0' }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                <div className="text-[11px] font-bold tracking-widest uppercase text-amber-700 flex items-center justify-between">Offline ANPR <WifiOff size={12} /> {amcFilter==='offlineANPR' && <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full">Filtered</span>}</div>
                <div className="mt-1 text-3xl font-extrabold text-amber-600">{amcStats.offlineANPR}</div>
                <div className="mt-1 text-xs font-bold"><span className={`px-1.5 py-0.5 rounded ${amcStats.anprOfflinePct>10?'bg-amber-100 text-amber-700':'bg-emerald-50 text-emerald-700'}`}>{amcStats.anprOfflinePct}% offline</span> <span className="text-slate-500 font-normal ml-1">of {amcStats.totalANPR}</span></div>
                <div className="mt-2 text-[11px] font-semibold text-amber-700 flex items-center gap-1">{amcFilter==='offlineANPR' ? 'Showing offline only • Click to show all' : 'Click to show sites with offline →'}</div>
              </button>
            </div>

            {/* Filter banner when offline selected */}
            {amcFilter!=='all' && (
              <div className="mb-3 flex items-center justify-between px-4 py-2.5 rounded-xl border bg-amber-50" style={{ borderColor:'#fde68a' }}>
                <span className="text-sm font-bold text-amber-800 flex items-center gap-2"><WifiOff size={14} /> {amcFilter==='offlineCam' ? `Showing ${amcStats.perSite.filter(s=>s.offlineCameras>0).length} sites with offline cameras` : `Showing ${amcStats.perSite.filter(s=>s.offlineANPR>0).length} sites with offline ANPR`}</span>
                <button onClick={()=>setAmcFilter('all')} className="px-3 py-1 rounded-full bg-white border text-xs font-bold hover:bg-slate-50" style={{ borderColor:'#e2e8f0' }}>Show all {sites.length} sites ✕</button>
              </div>
            )}

            {/* All sites in ONE chart — grouped bar — scrollable for 80 sites */}
            <PowerBICard title={amcFilter==='offlineCam' ? 'Offline Cameras — by Site' : amcFilter==='offlineANPR' ? 'Offline ANPR — by Site' : 'All Sites — Cameras & ANPR'} subtitle={`${amcFilter==='all' ? sites.length : amcFilter==='offlineCam' ? amcStats.perSite.filter(s=>s.offlineCameras>0).length : amcStats.perSite.filter(s=>s.offlineANPR>0).length} sites • ${amcFilter==='all' ? 'Total vs Offline — one chart • Scroll →' : 'Filtered — click table row to edit'}`} icon={BarChart3} className="mb-4">
              <div className="overflow-x-auto -mx-2">
                <div style={{ minWidth: `${Math.max(900, (amcFilter==='all' ? sites.length : amcFilter==='offlineCam' ? amcStats.perSite.filter(s=>s.offlineCameras>0).length : amcStats.perSite.filter(s=>s.offlineANPR>0).length) * 32)}px`, height: 360 }}>
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={amcFilter==='all' ? amcStats.perSite : amcFilter==='offlineCam' ? amcStats.perSite.filter(s=>s.offlineCameras>0) : amcStats.perSite.filter(s=>s.offlineANPR>0)} margin={{ top: 8, right: 16, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} interval={0} angle={-45} textAnchor="end" height={60} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="totalCameras" name="Total Cameras" fill="#0284c7" radius={[3,3,0,0]} barSize={4} />
                  <Bar dataKey="offlineCameras" name="Offline CCTV" fill="#ef4444" radius={[3,3,0,0]} barSize={4} />
                  <Bar dataKey="totalANPR" name="Total ANPR" fill="#7c3aed" radius={[3,3,0,0]} barSize={4} />
                  <Bar dataKey="offlineANPR" name="Offline ANPR" fill="#f59e0b" radius={[3,3,0,0]} barSize={4} />
                  <Bar dataKey="notWorkingANPR" name="Not Working ACS" fill="#a855f7" radius={[3,3,0,0]} barSize={4} />
                  <Bar dataKey="notWorkingGate" name="Not Working Gate barrier" fill="#0ea5e9" radius={[3,3,0,0]} barSize={4} />
                  <Bar dataKey="notWorkingIntercom" name="Not Working Intercom" fill="#1e293b" radius={[3,3,0,0]} barSize={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 lg:grid-cols-7 gap-2 text-[11px]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-sky-600" />Total Cam</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" />Offline CCTV</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-violet-600" />Total ANPR</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />Offline ANPR</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />Not Work ACS</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />Gate barrier</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-800" />Intercom</span>
              </div>
            </PowerBICard>

            {/* Table — per site AMC — scrollable for 80 sites — filters to offline */}
            <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:'#e2e8f0' }}>
              <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor:'#eef2f7' }}>
                <div className="text-sm font-bold">Per-Site AMC Breakdown {amcFilter!=='all' && <span className="ml-2 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs border border-amber-200">Filtered</span>}</div>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-50 border font-medium" style={{ borderColor:'#e2e8f0' }}>{amcFilter==='all' ? sites.length : amcFilter==='offlineCam' ? amcStats.perSite.filter(s=>s.offlineCameras>0).length : amcStats.perSite.filter(s=>s.offlineANPR>0).length} sites • Scroll ↕</span>
              </div>
              <div className="overflow-auto max-h-[420px]">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs font-bold tracking-widest uppercase text-slate-500 border-b" style={{ borderColor:'#e2e8f0' }}>
                    <tr>
                      <th className="text-left px-3 py-2.5">Site</th>
                      <th className="text-center px-3 py-2.5">Total Cam</th>
                      <th className="text-center px-3 py-2.5">Offline</th>
                      <th className="text-center px-3 py-2.5">Uptime</th>
                      <th className="text-center px-3 py-2.5">Total ANPR</th>
                      <th className="text-center px-3 py-2.5">Offline ANPR</th>
                      <th className="text-center px-3 py-2.5">Not Work.</th>
                      <th className="text-center px-3 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor:'#f1f5f9' }}>
                    {(amcFilter==='all' ? amcStats.perSite : amcFilter==='offlineCam' ? amcStats.perSite.filter(s=>s.offlineCameras>0) : amcStats.perSite.filter(s=>s.offlineANPR>0)).map(r=>{
                      const camPct = r.totalCameras ? Math.round(((r.totalCameras - r.offlineCameras)/r.totalCameras)*100) : 100
                      const siteObj = sites.find(s=>s.name===r.fullName)
                      return (
                        <tr key={r.fullName} onClick={()=> siteObj && openEdit(siteObj)} className="hover:bg-slate-50 cursor-pointer">
                          <td className="px-3 py-2.5"><div className="font-semibold line-clamp-1 flex items-center gap-1.5">{r.fullName} {r.offlineCameras>0 && <WifiOff size={10} className="text-red-500" />}</div><div className="text-xs text-slate-500">{sites.find(s=>s.name===r.fullName)?.location || ''}</div></td>
                          <td className="text-center font-bold">{r.totalCameras}</td>
                          <td className="text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold border ${r.offlineCameras>0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{r.offlineCameras}</span></td>
                          <td className="text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold ${camPct>=95?'bg-emerald-100 text-emerald-700':camPct>=90?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{camPct}%</span></td>
                          <td className="text-center font-bold">{r.totalANPR}</td>
                          <td className="text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold border ${r.offlineANPR>0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{r.offlineANPR}</span></td>
                          <td className="text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold border ${r.notWorkingANPR>0 ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>{r.notWorkingANPR}</span></td>
                          <td className="text-center"><span className={`w-2 h-2 rounded-full inline-block ${r.offlineCameras>2 || r.offlineANPR>1 || r.notWorkingANPR>0 ? 'bg-red-500' : r.offlineCameras>0 ? 'bg-amber-500' : 'bg-emerald-500'}`} /></td>
                        </tr>
                      )
                    })}
                    {amcFilter!=='all' && (amcFilter==='offlineCam' ? amcStats.perSite.filter(s=>s.offlineCameras>0).length===0 : amcStats.perSite.filter(s=>s.offlineANPR>0).length===0) && (
                      <tr><td colSpan="8" className="text-center py-8 text-sm text-slate-500">No sites with {amcFilter==='offlineCam' ? 'offline cameras' : 'offline ANPR'} — all online ✅ <button onClick={()=>setAmcFilter('all')} className="ml-2 underline font-semibold">Show all</button></td></tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white text-sm font-bold">
                    <tr>
                      <td className="px-3 py-2.5">TOTAL — All Sites</td>
                      <td className="text-center">{amcStats.totalCameras}</td>
                      <td className="text-center text-red-300">{amcStats.offlineCameras}</td>
                      <td className="text-center">{amcStats.totalCameras ? Math.round((amcStats.onlineCameras/amcStats.totalCameras)*100) : 100}%</td>
                      <td className="text-center">{amcStats.totalANPR}</td>
                      <td className="text-center text-amber-300">{amcStats.offlineANPR}</td>
                      <td className="text-center text-violet-300">{amcStats.notWorkingANPR}</td>
                      <td className="text-center">—</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-400">
          {page==='sites' ? 'Page: Sites • ' : page==='charts' ? 'Page: Charts • ' : page==='amc' ? 'Page: AMC • ' : page==='attention' ? 'Page: Attention • ' : 'Page: Incidents • '}
          <button onClick={()=>{
            if(page==='sites') setPage('charts')
            else if(page==='charts') setPage('amc')
            else if(page==='amc') setPage('attention')
            else if(page==='attention') setPage('incidents')
            else setPage('sites')
          }} className="underline font-semibold hover:text-slate-700">Go to {page==='sites'?'Charts':page==='charts'?'AMC':page==='amc'?'Attention':page==='attention'?'Incidents':'Sites'} →</button>
        </p>
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-40 grid place-items-center p-4">
            <div onClick={()=>setShowAdd(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.form onSubmit={handleSave} initial={{ scale:0.96, y:8 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:8 }} className="relative w-full max-w-[640px] bg-white rounded-[24px] shadow-2xl border overflow-hidden max-h-[90vh] flex flex-col" style={{ borderColor: '#e2e8f0' }}>
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center"><Building2 size={18} /></div><div><div className="font-bold leading-none">{editing ? 'Edit Site' : 'Add New Site'}</div><div className="text-xs text-slate-500">Site inspection entry</div></div></div>
                <button type="button" onClick={()=>setShowAdd(false)} className="w-8 h-8 grid place-items-center rounded-full hover:bg-slate-100"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4 overflow-auto">
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Site Name *</label>
                  <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="e.g. Marina Bay Tower - Level 24" className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white outline-none focus:border-slate-400" style={{ borderColor: '#e2e8f0' }} />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Location / Address *</label>
                  <div className="mt-1.5 relative"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} placeholder="e.g. Dubai Marina, Block B" className="w-full pl-9 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white outline-none focus:border-slate-400" style={{ borderColor: '#e2e8f0' }} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Type</label>
                    <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})} className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" style={{ borderColor: '#e2e8f0' }}>{TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Status</label>
                    <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" style={{ borderColor: '#e2e8f0' }}>{STATUSES.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Inspection Date</label>
                    <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" style={{ borderColor: '#e2e8f0' }} />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Inspector</label>
                    <div className="mt-1.5 relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={form.inspector} onChange={e=>setForm({...form, inspector:e.target.value})} placeholder="e.g. Ahmed R." className="w-full pl-9 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white outline-none focus:border-slate-400" style={{ borderColor: '#e2e8f0' }} /></div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Notes</label>
                  <textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} rows={3} placeholder="Findings, remarks, next action..." className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white outline-none focus:border-slate-400" style={{ borderColor: '#e2e8f0' }} />
                </div>
                <div className="rounded-xl border bg-sky-50/50 p-3" style={{ borderColor:'#e0f2fe' }}>
                  <div className="text-xs font-bold tracking-widest uppercase text-sky-700 flex items-center gap-1.5"><Video size={12} /> AMC — Cameras & ANPR</div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Total Cameras</label>
                      <input type="number" min="0" value={form.totalCameras} onChange={e=>setForm({...form, totalCameras: Math.max(0, parseInt(e.target.value)||0)})} className="mt-1 w-full px-3 py-2.5 rounded-xl border bg-white outline-none" style={{ borderColor:'#e2e8f0' }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Offline Cameras</label>
                      <input type="number" min="0" max={form.totalCameras} value={form.offlineCameras} onChange={e=>setForm({...form, offlineCameras: Math.max(0, Math.min(form.totalCameras, parseInt(e.target.value)||0))})} className="mt-1 w-full px-3 py-2.5 rounded-xl border bg-white outline-none" style={{ borderColor: form.offlineCameras>0 ? '#fecaca' : '#e2e8f0', background: form.offlineCameras>0 ? '#fef2f2' : 'white' }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Total ANPR</label>
                      <input type="number" min="0" value={form.totalANPR} onChange={e=>setForm({...form, totalANPR: Math.max(0, parseInt(e.target.value)||0)})} className="mt-1 w-full px-3 py-2.5 rounded-xl border bg-white outline-none" style={{ borderColor:'#e2e8f0' }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Offline ANPR</label>
                      <input type="number" min="0" max={form.totalANPR} value={form.offlineANPR} onChange={e=>setForm({...form, offlineANPR: Math.max(0, Math.min(form.totalANPR, parseInt(e.target.value)||0))})} className="mt-1 w-full px-3 py-2.5 rounded-xl border bg-white outline-none" style={{ borderColor: form.offlineANPR>0 ? '#fde68a' : '#e2e8f0', background: form.offlineANPR>0 ? '#fffbeb' : 'white' }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Not Working ACS</label>
                      <input type="number" min="0" max={form.totalANPR} value={form.notWorkingANPR} onChange={e=>setForm({...form, notWorkingANPR: Math.max(0, Math.min(form.totalANPR, parseInt(e.target.value)||0))})} className="mt-1 w-full px-3 py-2.5 rounded-xl border bg-white outline-none" style={{ borderColor: form.notWorkingANPR>0 ? '#ddd6fe' : '#e2e8f0', background: form.notWorkingANPR>0 ? '#f5f3ff' : 'white' }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Not Working Gate barrier</label>
                      <input type="number" min="0" value={form.notWorkingGate} onChange={e=>setForm({...form, notWorkingGate: Math.max(0, parseInt(e.target.value)||0)})} className="mt-1 w-full px-3 py-2.5 rounded-xl border bg-white outline-none" style={{ borderColor: form.notWorkingGate>0 ? '#bae6fd' : '#e2e8f0', background: form.notWorkingGate>0 ? '#f0f9ff' : 'white' }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Not Working Intercom</label>
                      <input type="number" min="0" value={form.notWorkingIntercom} onChange={e=>setForm({...form, notWorkingIntercom: Math.max(0, parseInt(e.target.value)||0)})} className="mt-1 w-full px-3 py-2.5 rounded-xl border bg-white outline-none" style={{ borderColor: form.notWorkingIntercom>0 ? '#cbd5e1' : '#e2e8f0', background: form.notWorkingIntercom>0 ? '#f8fafc' : 'white' }} />
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">Appears in AMC Dashboard • All sites in one chart • Problems by Category</div>
                </div>
              </div>
              <div className="p-4 border-t bg-slate-50 flex gap-3 justify-end" style={{ borderColor: '#e2e8f0' }}>
                <button type="button" onClick={()=>setShowAdd(false)} className="px-5 py-2.5 rounded-full border bg-white font-semibold hover:bg-slate-50" style={{ borderColor: '#e2e8f0' }}>Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold inline-flex items-center gap-2 hover:bg-black"><Save size={16} />{editing ? 'Save Changes' : 'Add Site'}</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incident Report Modal */}
      <AnimatePresence>
        {showIncident && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-40 grid place-items-center p-4">
            <div onClick={()=>setShowIncident(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.form onSubmit={handleIncidentSave} initial={{ scale:0.96, y:8 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:8 }} className="relative w-full max-w-[640px] bg-white rounded-[24px] shadow-2xl border overflow-hidden max-h-[90vh] flex flex-col" style={{ borderColor:'#e2e8f0' }}>
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor:'#e2e8f0' }}>
                <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-red-600 text-white grid place-items-center"><FileText size={18} /></div><div><div className="font-bold leading-none">{editingIncident ? 'Edit Report' : 'New Incident Report'}</div><div className="text-xs text-slate-500">Things reported • changes are tracked</div></div></div>
                <button type="button" onClick={()=>setShowIncident(false)} className="w-8 h-8 grid place-items-center rounded-full hover:bg-slate-100"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4 overflow-auto">
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Site *</label>
                  <select value={incForm.siteId} onChange={e=>setIncForm({...incForm, siteId:e.target.value})} className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" style={{ borderColor:'#e2e8f0' }}>
                    {sites.map(s=> <option key={s.id} value={s.id}>{s.name} — {s.location}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Title *</label>
                  <input value={incForm.title} onChange={e=>setIncForm({...incForm, title:e.target.value})} placeholder="e.g. Scaffold tie missing - North face" className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white outline-none" style={{ borderColor:'#e2e8f0' }} />
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Description</label>
                  <textarea value={incForm.description} onChange={e=>setIncForm({...incForm, description:e.target.value})} rows={3} placeholder="What was found? Include details for re-inspection..." className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white outline-none" style={{ borderColor:'#e2e8f0' }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Category</label>
                    <select value={incForm.category} onChange={e=>setIncForm({...incForm, category:e.target.value})} className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" style={{ borderColor:'#e2e8f0' }}>{PROBLEM_CATS.map(c=> <option key={c} value={c}>{c}</option>)}</select>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Severity</label>
                    <select value={incForm.severity} onChange={e=>setIncForm({...incForm, severity:e.target.value})} className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" style={{ borderColor:'#e2e8f0' }}>{SEVERITY.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}</select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Status</label>
                    <select value={incForm.status} onChange={e=>setIncForm({...incForm, status:e.target.value})} className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" style={{ borderColor:'#e2e8f0' }}>{INCIDENT_STATUS.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}</select>
                    <p className="text-[11px] text-slate-500 mt-1">Changing status is logged in history</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Date Reported</label>
                    <input type="date" value={incForm.date} onChange={e=>setIncForm({...incForm, date:e.target.value})} className="mt-1.5 w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none" style={{ borderColor:'#e2e8f0' }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-slate-500">Reported By</label>
                  <div className="mt-1.5 relative"><User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={incForm.reportedBy} onChange={e=>setIncForm({...incForm, reportedBy:e.target.value})} placeholder="e.g. Ahmed R." className="w-full pl-9 pr-4 py-3 rounded-xl border bg-slate-50 focus:bg-white outline-none" style={{ borderColor:'#e2e8f0' }} /></div>
                </div>
              </div>
              <div className="p-4 border-t bg-slate-50 flex gap-3 justify-end" style={{ borderColor:'#e2e8f0' }}>
                <button type="button" onClick={()=>setShowIncident(false)} className="px-5 py-2.5 rounded-full border bg-white font-semibold hover:bg-slate-50" style={{ borderColor:'#e2e8f0' }}>Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-full bg-red-600 text-white font-bold inline-flex items-center gap-2 hover:bg-red-700"><Save size={16} />{editingIncident ? 'Save Changes' : 'Report Incident'}</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Drawer */}
      <AnimatePresence>
        {viewHistory && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 grid place-items-center p-4">
            <div onClick={()=>setViewHistory(null)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale:0.96, y:8 }} animate={{ scale:1, y:0 }} exit={{ scale:0.96, y:8 }} className="relative w-full max-w-[520px] bg-white rounded-[24px] shadow-2xl border overflow-hidden max-h-[80vh] flex flex-col" style={{ borderColor:'#e2e8f0' }}>
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor:'#e2e8f0' }}>
                <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-slate-900 text-white grid place-items-center"><Clock3 size={16} /></div><div><div className="font-bold leading-none">Change History</div><div className="text-xs text-slate-500 truncate max-w-[280px]">{viewHistory.title} • {viewHistory.siteName}</div></div></div>
                <button onClick={()=>setViewHistory(null)} className="w-8 h-8 grid place-items-center rounded-full hover:bg-slate-100"><X size={18} /></button>
              </div>
              <div className="p-6 overflow-auto">
                <div className="relative pl-6 border-l-2 border-slate-100 space-y-4">
                  {viewHistory.history.map((h,i)=>(
                    <div key={i} className="relative">
                      <span className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-white shadow" />
                      <div className="bg-slate-50 rounded-xl p-3 border" style={{ borderColor:'#eef2f7' }}>
                        <div className="text-xs font-bold text-slate-900">{h.change}</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2"><span>{h.at}</span><span>•</span><span className="font-medium">{h.by}</span></div>
                      </div>
                    </div>
                  ))}
                  {viewHistory.history.length===0 && <div className="text-sm text-slate-500">No changes yet.</div>}
                </div>
                <div className="mt-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  <b>Note:</b> Every edit (title, description, status, severity) is auto-logged. Things reported have changed = full audit trail.
                </div>
              </div>
              <div className="p-4 border-t bg-slate-50 flex justify-end" style={{ borderColor:'#e2e8f0' }}>
                <button onClick={()=>setViewHistory(null)} className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-bold">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
