import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BriefcaseBusiness, CalendarDays,
  Check, ChevronDown, CircleHelp, ClipboardList, Command, FolderKanban, LayoutDashboard,
  LogOut, Menu, Plus, Search, Settings2, ShieldCheck, Sparkles, Users, X, Clock3,
  CircleCheck, CircleDot, ListTodo, MoreHorizontal, Filter, Zap
} from 'lucide-react'
import { api, clearSession, getUser, setSession } from './api'

const initialTasks = [
  { id: 'demo-1', title: 'Finalize Q4 product roadmap', projectName: 'Product launch', assignee: 'Aarav Sharma', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-11-03' },
  { id: 'demo-2', title: 'Review onboarding flow', projectName: 'Website refresh', assignee: 'Priya Patel', status: 'REVIEW', priority: 'MEDIUM', dueDate: '2026-11-04' },
  { id: 'demo-3', title: 'Prepare campaign report', projectName: 'Growth campaign', assignee: 'You', status: 'TODO', priority: 'URGENT', dueDate: '2026-11-05' },
  { id: 'demo-4', title: 'Update component library', projectName: 'Website refresh', assignee: 'Rohan Mehta', status: 'DONE', priority: 'LOW', dueDate: '2026-10-27' },
]
const demoProjects = [
  { id: 'd1', name: 'Product launch', client: 'Northstar Labs', status: 'ACTIVE', dueDate: '2026-11-18', description: 'Launch planning and delivery' },
  { id: 'd2', name: 'Website refresh', client: 'Lumen Studio', status: 'ACTIVE', dueDate: '2026-11-26', description: 'A refreshed customer experience' },
  { id: 'd3', name: 'Growth campaign', client: 'Orbit Finance', status: 'REVIEW', dueDate: '2026-12-02', description: 'Acquisition and retention campaign' },
]
const demoTeam = [
  { id: 1, fullName: 'Aarav Sharma', email: 'aarav@nexora.demo', role: 'MANAGER', title: 'Product manager' },
  { id: 2, fullName: 'Priya Patel', email: 'priya@nexora.demo', role: 'MEMBER', title: 'Product designer' },
  { id: 3, fullName: 'Rohan Mehta', email: 'rohan@nexora.demo', role: 'MEMBER', title: 'Frontend engineer' },
  { id: 4, fullName: 'You', email: 'you@nexora.demo', role: 'ADMIN', title: 'Workspace admin' },
]
const nav = [
  { label: 'Workspace', items: [{ id: 'Overview', icon: LayoutDashboard }, { id: 'Projects', icon: FolderKanban }, { id: 'My tasks', icon: ClipboardList }, { id: 'Team', icon: Users }] },
]
const initials = name => (name || 'NX').split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase()
const pretty = s => (s || '').toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
const dateLabel = s => s ? new Date(`${s}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ fullName: '', email: '', password: '', title: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true)
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const body = mode === 'login' ? { email: form.email, password: form.password } : form
      const data = await api(path, { method: 'POST', body: JSON.stringify(body) })
      setSession(data); onAuth(data)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <div className="auth-shell">
    <div className="auth-art">
      <div className="brand brand-light"><span className="brand-mark"><Command size={19}/></span> nexora</div>
      <div className="art-copy"><div className="eyebrow"><Sparkles size={14}/> YOUR WORK, IN SYNC</div><h1>Good work<br/>moves <em>together.</em></h1><p>Bring your projects, people and priorities into one calm, clear workspace.</p></div>
      <div className="floating-card"><div className="float-icon"><Activity size={18}/></div><div><b>Momentum is up 24%</b><small>Team productivity this month</small></div><span className="trend">↗ 24%</span></div>
      <div className="auth-art-footer">Thoughtfully built for teams that do great work.</div>
    </div>
    <div className="auth-form-side"><div className="auth-form">
      <div className="mobile-brand brand"><span className="brand-mark"><Command size={18}/></span> nexora</div>
      <div className="form-kicker">WELCOME TO NEXORA</div><h2>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h2><p className="muted">{mode === 'login' ? 'Enter your details to access your dashboard.' : 'A few details and you’re ready to get started.'}</p>
      <form onSubmit={submit}>
        {mode === 'register' && <><label>Full name</label><input name="fullName" value={form.fullName} onChange={update} placeholder="e.g. Alex Morgan" required maxLength="100"/><label>Your role</label><input name="title" value={form.title} onChange={update} placeholder="e.g. Product designer"/></>}
        <label>Work email</label><input type="email" name="email" value={form.email} onChange={update} placeholder="you@company.com" required/>
        <label>Password</label><input type="password" name="password" value={form.password} onChange={update} placeholder="At least 8 characters" required minLength="8"/>
        {error && <div className="error-box">{error}</div>}
        <button className="btn btn-primary full" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to Nexora' : 'Create account'} <span>→</span></button>
      </form>
      <div className="switch-auth">{mode === 'login' ? 'New to Nexora?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></div>
      <div className="secure-note"><ShieldCheck size={15}/> Your workspace is private and secure</div>
    </div></div>
  </div>
}

function Sidebar({ active, setActive, user, onLogout, open, close }) {
  return <>
    {open && <div className="mobile-scrim" onClick={close}/>}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Command size={19}/></span> nexora <span className="brand-tag">WORKSPACE</span><button className="mobile-close icon-btn" onClick={close}><X size={18}/></button></div>
      <button className="workspace-switch"><div className="workspace-logo">N</div><div className="workspace-text"><b>Northstar Studio</b><small>Free workspace</small></div><ChevronDown size={15}/></button>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav[0].items.map(item => <button key={item.id} onClick={() => { setActive(item.id); close() }} className={`nav-item ${active === item.id ? 'active' : ''}`}><item.icon size={18}/><span>{item.id}</span>{item.id === 'My tasks' && <span className="nav-count">4</span>}</button>)}</nav>
      <div className="nav-label nav-label-row">YOUR TOOLS <button className="tiny-plus" title="Add tool"><Plus size={14}/></button></div>
      <button className="nav-item" onClick={() => { setActive('Calendar'); close() }}><CalendarDays size={18}/><span>Calendar</span></button>
      <button className="nav-item" onClick={() => { setActive('Insights'); close() }}><Activity size={18}/><span>Insights</span></button>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><b>Need a hand?</b><p>Explore tips to make your work flow.</p><button onClick={() => alert('Tip: Create a project, then add tasks and assign them to teammates.')}>Explore guides <span>↗</span></button></div>
        <button className="nav-item settings-item" onClick={() => { setActive('Settings'); close() }}><Settings2 size={18}/><span>Settings</span></button>
        <div className="profile-row"><div className="avatar avatar-purple">{initials(user?.fullName)}</div><div className="profile-info"><b>{user?.fullName || 'Workspace member'}</b><small>{user?.role || 'MEMBER'}</small></div><button className="icon-btn" title="Sign out" onClick={onLogout}><LogOut size={17}/></button></div>
      </div>
    </aside>
  </>
}

function StatCard({ icon: Icon, label, value, delta, tint, note }) {
  return <div className="stat-card"><div className={`stat-icon ${tint}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-number">{value}</div><div className="stat-foot"><span className="stat-delta"><ArrowUpRight size={14}/>{delta}</span><span>{note}</span></div></div>
}

function TaskRow({ task, onStatus }) {
  return <div className="task-row">
    <button className={`task-check ${task.status === 'DONE' ? 'checked' : ''}`} title="Mark complete" onClick={() => onStatus(task, task.status === 'DONE' ? 'TODO' : 'DONE')}>{task.status === 'DONE' && <Check size={13}/>}</button>
    <div className="task-main"><b className={task.status === 'DONE' ? 'task-complete' : ''}>{task.title}</b><small>{task.projectName || 'General'} <span>·</span> Due {dateLabel(task.dueDate)}</small></div>
    <span className={`priority priority-${(task.priority || 'MEDIUM').toLowerCase()}`}>{pretty(task.priority)}</span>
    <span className={`status-pill status-${(task.status || 'TODO').toLowerCase()}`}>{pretty(task.status)}</span>
    <div className="mini-avatar" title={task.assignee}>{initials(task.assignee)}</div>
  </div>
}

function ProjectCard({ project }) {
  const hue = (project.name || 'N').charCodeAt(0) % 4
  return <div className="project-card"><div className="project-card-top"><div className={`project-symbol symbol-${hue}`}><FolderKanban size={19}/></div><button className="icon-btn"><MoreHorizontal size={19}/></button></div><div className="project-client">{project.client}</div><h3>{project.name}</h3><p>{project.description || 'Keep your team aligned and moving forward.'}</p><div className="project-progress"><div className="progress-caption"><span>Project health</span><b>{project.status === 'REVIEW' ? '82%' : '64%'}</b></div><div className="progress-track"><div className="progress-fill" style={{ width: project.status === 'REVIEW' ? '82%' : '64%' }}/></div></div><div className="project-card-bottom"><span><CalendarDays size={14}/> {dateLabel(project.dueDate)}</span><div className="avatar-stack"><span className="mini-avatar av1">AS</span><span className="mini-avatar av2">PP</span><span className="mini-avatar av3">+2</span></div></div></div>
}

function CreateModal({ kind, projects, team, onClose, onCreate }) {
  const [form, setForm] = useState(kind === 'project' ? { name: '', client: '', description: '', dueDate: '' } : { title: '', description: '', projectId: projects[0]?.id || '', assigneeId: team[0]?.id || '', priority: 'MEDIUM', dueDate: '' })
  const [error, setError] = useState('')
  const set = e => setForm({ ...form, [e.target.name]: e.target.value })
  async function submit(e) { e.preventDefault(); setError(''); try { await onCreate(form); onClose() } catch (e) { setError(e.message) } }
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}><div className="modal"><div className="modal-head"><div><div className="form-kicker">WORKSPACE</div><h2>{kind === 'project' ? 'Create a project' : 'Create a task'}</h2></div><button className="icon-btn" onClick={onClose}><X size={20}/></button></div><form onSubmit={submit}>
    <label>{kind === 'project' ? 'Project name' : 'Task title'}</label><input name={kind === 'project' ? 'name' : 'title'} value={kind === 'project' ? form.name : form.title} onChange={set} required placeholder={kind === 'project' ? 'e.g. Mobile app launch' : 'e.g. Prepare launch checklist'}/>
    {kind === 'project' ? <><label>Client</label><input name="client" value={form.client} onChange={set} required placeholder="Client or team name"/><label>Description</label><textarea name="description" value={form.description} onChange={set} rows="3" placeholder="What does success look like?"/></> : <><label>Project</label><select name="projectId" value={form.projectId} onChange={set} required>{projects.filter(p => !String(p.id).startsWith('d')).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><label>Assignee</label><select name="assigneeId" value={form.assigneeId} onChange={set} required>{team.filter(t => !String(t.id).startsWith('d')).map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}</select><label>Priority</label><select name="priority" value={form.priority} onChange={set}><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>URGENT</option></select><label>Description</label><textarea name="description" value={form.description} onChange={set} rows="2" placeholder="Add a little context…"/></>}
    <label>Due date</label><input type="date" name="dueDate" value={form.dueDate} onChange={set} required/>
    {error && <div className="error-box">{error}</div>}<div className="modal-actions"><button type="button" className="btn btn-quiet" onClick={onClose}>Cancel</button><button className="btn btn-primary">{kind === 'project' ? 'Create project' : 'Create task'} <span>→</span></button></div>
  </form></div></div>
}

function App() {
  const [user, setUser] = useState(getUser())
  const [active, setActive] = useState('Overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [modal, setModal] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [tasks, setTasks] = useState(initialTasks)
  const [projects, setProjects] = useState(demoProjects)
  const [team, setTeam] = useState(demoTeam)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [stats, setStats] = useState({ projects: 3, teamMembers: 4, totalTasks: 12, doneTasks: 8, inProgressTasks: 3, myTasks: 4 })
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)
  const isDemo = tasks.some(t => String(t.id).startsWith('demo-'))
  const canManage = ['ADMIN', 'MANAGER'].includes(user?.role)
  const notify = msg => { setToast(msg); window.setTimeout(() => setToast(''), 3200) }

  async function loadData() {
    setLoading(true)
    try {
      const [p, t, tm, s, n, unread] = await Promise.all([
        api('/projects'), api('/tasks'), api('/team'), api('/dashboard/summary'),
        api('/notifications'), api('/notifications/unread-count')
      ])
      setProjects(p); setTasks(t); setTeam(tm); setStats(s)
      setNotifications(n); setUnreadCount(unread.count)
    } catch (e) {
      if (getUser()) notify(`${e.message}. Showing preview data until the API is available.`)
    } finally { setLoading(false) }
  }
  useEffect(() => { if (user) loadData() }, [user?.id])
  async function createItem(form) {
    if (isDemo) throw new Error('Create a real project first. Demo preview items are not saved in the database.')
    if (modal === 'project') {
      const p = await api('/projects', { method: 'POST', body: JSON.stringify(form) })
      setProjects(prev => [p, ...prev]); notify('Project created successfully.')
    } else {
      const t = await api('/tasks', { method: 'POST', body: JSON.stringify({ ...form, projectId: Number(form.projectId), assigneeId: Number(form.assigneeId) }) })
      setTasks(prev => [t, ...prev]); notify('Task created successfully.')
    }
    loadData()
  }
  async function updateStatus(task, status) {
    if (String(task.id).startsWith('demo-')) { setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status } : t)); notify('Preview task updated locally.'); return }
    try { const updated = await api(`/tasks/${task.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); setTasks(prev => prev.map(t => t.id === updated.id ? updated : t)); notify('Task status updated.') }
    catch (e) { notify(e.message) }
  }
  function logout() { clearSession(); setUser(null); setTasks(initialTasks); setProjects(demoProjects); setTeam(demoTeam) }
  async function markNotificationRead(id) {
    await api(`/notifications/${id}/read`, { method: 'PATCH' })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }
  async function markAllNotificationsRead() {
    await api('/notifications/read-all', { method: 'PATCH' })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }
  async function saveProfile(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const fullName = form.get('fullName')
    const title = form.get('title')
    try {
      const updated = await api(`/team/${user.id}/profile`, { method: 'PATCH', body: JSON.stringify({ fullName, title }) })
      setUser(prev => ({ ...prev, fullName: updated.fullName, title: updated.title }))
      localStorage.setItem('nexora_user', JSON.stringify({ ...user, fullName: updated.fullName, title: updated.title }))
      notify('Profile updated successfully.')
      loadData()
    } catch (err) { notify(err.message) }
  }
  const filteredTasks = useMemo(() => tasks.filter(t => {
    const q = search.toLowerCase()
    const matches = [t.title, t.projectName, t.assignee, t.status].some(v => String(v || '').toLowerCase().includes(q))
    return matches && (filter === 'ALL' || t.status === filter)
  }), [tasks, search, filter])
  if (!user) return <AuthScreen onAuth={data => setUser({ id: data.id, fullName: data.fullName, email: data.email, role: data.role, title: data.title })}/>

  const pageTitles = {
    'Overview': ['Good morning', 'Here’s what’s happening across your workspace.'],
    'Projects': ['Projects', 'A clear view of everything your team is building.'],
    'My tasks': ['Tasks & priorities', 'Keep the important work moving forward.'],
    'Team': ['Your team', 'The people making great work happen.'],
    'Calendar': ['Work calendar', 'Plan deadlines and upcoming deliverables.'],
    'Notifications': ['Notifications', 'Stay informed about workspace activity.'],
    'Insights': ['Workspace insights', 'Understand delivery, workload and momentum.'],
    'Settings': ['Workspace settings', 'Manage your profile and workspace preferences.']
  }
  const title = pageTitles[active] || pageTitles.Overview
  return <div className="app-shell">
    <Sidebar active={active} setActive={setActive} user={user} onLogout={logout} open={mobileNav} close={() => setMobileNav(false)}/>
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-btn menu-trigger" onClick={() => setMobileNav(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div></div><div className="topbar-actions"><div className="top-search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search anything…"/><kbd>⌘ K</kbd></div><button className="icon-btn notification-btn" title="Notifications" onClick={() => setActive('Notifications')}><Bell size={19}/>{unreadCount > 0 && <i/>}</button><div className="top-divider"/><div className="top-user"><div className="avatar avatar-purple">{initials(user.fullName)}</div><ChevronDown size={15}/></div></div></header>
      <div className="page-content">
        <section className="page-heading"><div><div className="date-kicker"><span className="live-dot"/> MONDAY, OCTOBER 29, 2026</div><h1>{title[0]}{active === 'Overview' ? `, ${user.fullName.split(' ')[0]}` : ''}<span className="heading-wave">✳</span></h1><p>{title[1]}</p></div><div className="heading-actions"><button className="btn btn-quiet" onClick={() => notify('Your workspace report is ready to review.') }><Activity size={16}/> View report</button>{canManage && <button className="btn btn-primary" onClick={() => setModal(active === 'Projects' ? 'project' : 'task')}><Plus size={17}/> {active === 'Projects' ? 'New project' : 'Create task'}</button>}</div></section>
        {isDemo && <div className="preview-banner"><Sparkles size={16}/><span><b>Preview workspace</b> — Sample cards help you explore the design. Register and connect the API to start saving real data.</span><button onClick={() => setActive('Projects')}>Explore projects <span>→</span></button></div>}
        {active === 'Overview' && <>
          <section className="stats-grid">
            <StatCard icon={FolderKanban} label="Active projects" value={stats.projects} delta="+12.5%" note="vs last month" tint="tint-violet"/>
            <StatCard icon={Users} label="Team members" value={stats.teamMembers} delta="+2" note="this month" tint="tint-blue"/>
            <StatCard icon={ListTodo} label="Tasks in progress" value={stats.inProgressTasks} delta="+8.2%" note="vs last month" tint="tint-amber"/>
            <StatCard icon={CircleCheck} label="Tasks completed" value={stats.doneTasks} delta="+18.4%" note="vs last month" tint="tint-green"/>
          </section>
          <section className="dashboard-grid">
            <div className="panel task-panel"><div className="panel-heading"><div><h2>Priority tasks</h2><p>Your team’s focus, at a glance</p></div><button className="text-action" onClick={() => setActive('My tasks')}>View all <span>→</span></button></div>
              <div className="task-toolbar"><div className="task-tabs">{[['ALL','All tasks'],['IN_PROGRESS','In progress'],['TODO','To do']].map(([v,l])=><button key={v} className={filter===v?'selected':''} onClick={() => setFilter(v)}>{l}</button>)}</div><button className="filter-btn" onClick={() => setFilter(filter === 'ALL' ? 'REVIEW' : 'ALL')}><Filter size={14}/> Filter</button></div>
              <div className="task-list">{filteredTasks.slice(0,5).map(t=><TaskRow key={t.id} task={t} onStatus={updateStatus}/>)}{!filteredTasks.length && <div className="empty-state">No tasks match your search.</div>}</div>
              <div className="panel-footer"><span>Showing {Math.min(filteredTasks.length,5)} of {filteredTasks.length} tasks</span><button onClick={() => setActive('My tasks')}>Open task board <span>→</span></button></div>
            </div>
            <div className="panel activity-panel"><div className="panel-heading"><div><h2>Workspace pulse</h2><p>A snapshot of your momentum</p></div><button className="icon-btn"><MoreHorizontal size={18}/></button></div>
              <div className="pulse-score"><div className="score-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" className="ring-bg"/><circle cx="60" cy="60" r="48" className="ring-value"/></svg><div><b>78</b><small>/100</small></div></div><div className="pulse-copy"><span className="pulse-label">HEALTHY MOMENTUM</span><h3>Things are moving<br/>in the right direction.</h3><p>Project delivery is looking strong this week.</p></div></div>
              <div className="pulse-divider"/>
              <div className="pulse-metric"><div className="metric-icon metric-green"><Check size={16}/></div><div><b>On-track delivery</b><small>Most deadlines are looking good</small></div><strong>84%</strong></div>
              <div className="pulse-metric"><div className="metric-icon metric-blue"><Clock3 size={16}/></div><div><b>Team capacity</b><small>Room for focused work</small></div><strong>72%</strong></div>
              <div className="pulse-note"><Zap size={15}/><span><b>Nice momentum.</b> Your team completed 6 tasks this week.</span></div>
            </div>
          </section>
          <section className="panel projects-panel"><div className="panel-heading"><div><h2>Projects in motion</h2><p>Keep an eye on your team’s current work</p></div><button className="text-action" onClick={() => setActive('Projects')}>All projects <span>→</span></button></div><div className="project-grid">{projects.slice(0,3).map(p=><ProjectCard key={p.id} project={p}/>)}</div></section>
        </>}
        {active === 'Projects' && <section className="projects-page"><div className="section-toolbar"><div className="result-count">{projects.length} projects <span>·</span> {projects.filter(p=>p.status==='ACTIVE').length} active</div>{canManage && <button className="btn btn-primary" onClick={() => setModal('project')}><Plus size={16}/> New project</button>}</div><div className="project-grid">{projects.filter(p => [p.name,p.client].some(v=>String(v||'').toLowerCase().includes(search.toLowerCase()))).map(p=><ProjectCard key={p.id} project={p}/>)}</div>{!projects.length&&<div className="empty-state panel">No projects yet. Create your first project to get started.</div>}</section>}
        {active === 'My tasks' && <section className="panel all-tasks-panel"><div className="panel-heading"><div><h2>Task board</h2><p>Search, filter and update your work</p></div><select className="filter-select" value={filter} onChange={e=>setFilter(e.target.value)}><option value="ALL">All statuses</option><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="REVIEW">Review</option><option value="DONE">Done</option></select></div><div className="task-list">{filteredTasks.map(t=><TaskRow key={t.id} task={t} onStatus={updateStatus}/>)}</div>{!filteredTasks.length&&<div className="empty-state">No tasks found.</div>}</section>}
        {active === 'Team' && <section className="panel team-panel"><div className="panel-heading"><div><h2>People & roles</h2><p>Everyone contributing to the workspace</p></div><span className="team-count"><Users size={15}/> {team.length} members</span></div><div className="team-grid">{team.filter(t=>[t.fullName,t.email,t.title,t.role].some(v=>String(v||'').toLowerCase().includes(search.toLowerCase()))).map((m,i)=><div className="team-card" key={m.id}><div className={`team-avatar team-tone-${i%5}`}>{initials(m.fullName)}</div><div className="team-person"><b>{m.fullName}</b><small>{m.title || pretty(m.role)}</small><span>{m.email}</span></div><span className={`role-tag role-${m.role.toLowerCase()}`}>{pretty(m.role)}</span></div>)}</div></section>}
        {active === 'Calendar' && <section className="panel calendar-panel"><div className="panel-heading"><div><h2>Upcoming deadlines</h2><p>Tasks and deliverables grouped by due date</p></div><span className="team-count"><CalendarDays size={15}/> {tasks.filter(t=>t.dueDate).length} dated items</span></div><div className="calendar-list">{tasks.filter(t=>t.dueDate).sort((a,b)=>String(a.dueDate).localeCompare(String(b.dueDate))).map(task=><div className="calendar-row" key={task.id}><div className="calendar-date"><b>{dateLabel(task.dueDate).split(' ')[1]}</b><span>{dateLabel(task.dueDate).split(' ')[0]}</span></div><div className="calendar-main"><b>{task.title}</b><small>{task.projectName || 'General'} · {task.assignee}</small></div><span className={`status-pill status-${(task.status||'TODO').toLowerCase()}`}>{pretty(task.status)}</span></div>)}</div>{!tasks.length&&<div className="empty-state">No deadlines scheduled.</div>}</section>}
        {active === 'Notifications' && <section className="panel notifications-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>{unreadCount ? `${unreadCount} unread notification${unreadCount===1?'':'s'}` : 'You are all caught up'}</p></div>{unreadCount>0&&<button className="text-action" onClick={markAllNotificationsRead}>Mark all as read</button>}</div><div className="notification-list">{notifications.map(n=><button key={n.id} className={`notification-row ${n.read?'read':''}`} onClick={()=>!n.read&&markNotificationRead(n.id)}><span className="notification-dot"/><div><b>{n.title}</b><p>{n.message}</p><small>{n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'}</small></div></button>)}</div>{!notifications.length&&<div className="empty-state">No notifications yet.</div>}</section>}
        {active === 'Insights' && <section className="insights-page"><div className="stats-grid"><StatCard icon={FolderKanban} label="Active projects" value={stats.projects} delta="+12.5%" note="workspace total" tint="tint-violet"/><StatCard icon={ListTodo} label="Open tasks" value={Math.max(0,(stats.totalTasks||0)-(stats.doneTasks||0))} delta="+8.2%" note="need attention" tint="tint-amber"/><StatCard icon={CircleCheck} label="Completion" value={`${stats.totalTasks ? Math.round((stats.doneTasks/stats.totalTasks)*100) : 0}%`} delta="+18.4%" note="task completion" tint="tint-green"/><StatCard icon={Users} label="Team capacity" value={`${stats.teamMembers ? 72 : 0}%`} delta="+4%" note="available this week" tint="tint-blue"/></div><div className="dashboard-grid"><div className="panel insights-panel"><div className="panel-heading"><div><h2>Delivery health</h2><p>Task status distribution</p></div></div><div className="health-bars">{[['Done',stats.doneTasks,'#55b58c'],['In progress',stats.inProgressTasks,'#638dd7'],['Other',Math.max(0,(stats.totalTasks||0)-(stats.doneTasks||0)-(stats.inProgressTasks||0)),'#9d94dd']].map(([label,value,color])=><div className="health-row" key={label}><div><span>{label}</span><b>{value||0}</b></div><div className="progress-track"><div className="progress-fill" style={{width:`${stats.totalTasks?Math.round((value/stats.totalTasks)*100):0}%`,background:color}}/></div></div>)}</div></div><div className="panel insights-panel"><div className="panel-heading"><div><h2>Team snapshot</h2><p>Current workspace distribution</p></div></div><div className="team-snapshot"><div className="snapshot-ring">{stats.teamMembers||0}<span>people</span></div><div><b>{team.filter(m=>m.role==='ADMIN').length} administrators</b><b>{team.filter(m=>m.role==='MANAGER').length} managers</b><b>{team.filter(m=>m.role==='MEMBER').length} members</b></div></div></div></div></section>}
        {active === 'Settings' && <section className="panel settings-panel"><div className="panel-heading"><div><h2>Profile</h2><p>Update the information shown across your workspace</p></div></div><form className="settings-form" onSubmit={saveProfile}><div className="settings-avatar">{initials(user.fullName)}</div><div className="settings-fields"><label>Full name<input name="fullName" defaultValue={user.fullName} required maxLength="100"/></label><label>Job title<input name="title" defaultValue={user.title||''} maxLength="100" placeholder="e.g. Product manager"/></label><label>Email<input value={user.email} disabled/></label><button className="btn btn-primary" type="submit">Save profile</button></div></form></section>}
        <footer className="app-footer"><span>© 2026 Nexora Workspace</span><span><span className="footer-status"/> All systems operational</span><span>Made for focused teams <span className="footer-heart">✳</span></span></footer>
      </div>
    </main>
    {modal && <CreateModal kind={modal} projects={projects} team={team} onClose={() => setModal('')} onCreate={createItem}/>}
    {toast && <div className="toast"><CircleCheck size={17}/>{toast}<button onClick={() => setToast('')}><X size={15}/></button></div>}
  </div>
}
export default App
