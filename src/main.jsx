import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';

// Set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in a local .env file.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'SUPABASE_URL';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || 'SUPABASE_KEY';

const URL = "https://api.tanmayb.in/"

async function fetchIssueConditionDetails() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/issuecond?select=issue_details`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}): ${await response.text()}`);
  const rows = await response.json();
  return rows.map(row => typeof row.issue_details === 'string' ? JSON.parse(row.issue_details) : row.issue_details).filter(Boolean);
}

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/' },
  { label: 'Tickets', icon: 'confirmation_number', path: '/tickets' },
  { label: 'Citizen Reports', icon: 'report_problem', path: '/report' },
  { label: 'University Portal', icon: 'school', path: '/university' },
  { label: 'Activity Logs', icon: 'history_edu', path: '/activity' },
  { label: 'Public Impact', icon: 'auto_graph', path: '/impact' },
];

const challenges = [
  ['CH-26043', 'Severe potholes on Main Road', 'Infrastructure', 'Ranchi', 'Urgent'],
  ['CH-26039', 'Irregular water supply in Ward 12', 'Water Supply', 'Bokaro', 'In Progress'],
  ['CH-26031', 'Streetlights not working near school', 'Electricity', 'Dhanbad', 'Under Review'],
  ['CH-26018', 'Waste collection point overflow', 'Sanitation', 'Jamshedpur', 'Resolved'],
];

function Icon({ children }) { return <span className="material-symbols-outlined">{children}</span>; }

function LocationPicker({ onSelect }) {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const defaultPosition = [23.3441, 85.3096];
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  onSelectRef.current = onSelect;

  useEffect(() => {
    const map = L.map(mapElement.current).setView(defaultPosition, 12);
    mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const chooseLocation = event => {
      const coordinates = { latitude: event.latlng.lat, longitude: event.latlng.lng };
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker(event.latlng).addTo(map);
      onSelectRef.current(coordinates);
      console.log('Selected location coordinates:', coordinates);
    };
    map.on('click', chooseLocation);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => map.setView([position.coords.latitude, position.coords.longitude], 14),
        () => console.info('Location permission was not granted; showing the default map area.'),
      );
    }

    return () => map.remove();
  }, []);

  const searchLocation = async () => {
    if (!searchText.trim()) return;
    setIsSearching(true);
    setSearchError('');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(searchText)}`);
      if (!response.ok) throw new Error('Location search failed.');
      const results = await response.json();
      if (!results.length) throw new Error('No matching location found.');
      const match = results[0];
      const position = [Number(match.lat), Number(match.lon)];
      mapRef.current.setView(position, 16);
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker(position).addTo(mapRef.current).bindPopup('Pinpoint this location on the map').openPopup();
    } catch (searchRequestError) {
      setSearchError(searchRequestError instanceof Error ? searchRequestError.message : 'Location search failed.');
    } finally {
      setIsSearching(false);
    }
  };

  return <div className="location-picker"><p>Search for a nearby place, then click the exact point on the map to pinpoint your location.</p><div className="location-search"><input aria-label="Search for a location" value={searchText} onChange={event => setSearchText(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); searchLocation(); } }} placeholder="Search a place or address" /><button className="outline-button" type="button" onClick={searchLocation} disabled={isSearching}>{isSearching ? 'Searching...' : <><Icon>search</Icon> Search</>}</button></div>{searchError && <span className="location-search-error">{searchError}</span>}<div ref={mapElement} className="location-map" /></div>;
}

function Sidebar({ path, onNavigate }) {
  return <aside className="sidebar">
    <div>
      <div className="brand-block"><div className="seal">J</div><div><strong>Admin Portal</strong><span>State Dashboard</span></div></div>
      <button className="primary-button new-challenge" onClick={() => onNavigate('/report')}><Icon>add</Icon> New Challenge</button>
      <nav className="side-nav">
        {navItems.map(item => <button key={item.path} className={path === item.path ? 'active' : ''} onClick={() => onNavigate(item.path)}><Icon>{item.icon}</Icon><span>{item.label}</span></button>)}
      </nav>
    </div>
    <div className="sidebar-bottom"><button><Icon>settings</Icon>Settings</button><button><Icon>help_outline</Icon>Help &amp; Support</button><div className="admin-chip"><span>JA</span><div><b>Jharkhand Admin</b><small>State Officer</small></div></div></div>
  </aside>;
}

function Header({ path, onNavigate }) {
  const [search, setSearch] = useState('');
  return <header className="topbar"><button className="mobile-menu" aria-label="Open navigation"><Icon>menu</Icon></button><button className="wordmark" onClick={() => onNavigate('/')}><span>Jharkhand</span> Samadhan</button><nav className="public-nav"><button className={path === '/' ? 'selected' : ''} onClick={() => onNavigate('/')}>Challenges</button><button className={path === '/map' ? 'selected' : ''} onClick={() => onNavigate('/map')}>Map</button><button className={path === '/university' ? 'selected' : ''} onClick={() => onNavigate('/university')}>University Hub</button><button className={path === '/impact' || path === '/story' ? 'selected' : ''} onClick={() => onNavigate('/impact')}>Impact</button></nav><div className="top-actions"><div className="search"><Icon>search</Icon><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." /></div><button className="icon-button" title="Notifications"><Icon>notifications</Icon></button><div className="avatar">JA</div></div></header>;
}

function Layout({ children, path, onNavigate }) { return <div className="app-layout"><Sidebar path={path} onNavigate={onNavigate} /><div className="main-column"><Header path={path} onNavigate={onNavigate} /><main>{children}</main></div></div>; }
function PageHeader({ eyebrow, title, description, action }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>; }
function Status({ children }) { const isPriority = typeof children === 'string' && children.endsWith('%'); return <span className={`status ${isPriority ? `ticket-priority priority-${children.replace('%', '')}` : `status-${children.toLowerCase().replaceAll(' ', '-')}`}`}>{children}</span>; }
function Stat({ value, label, change, icon }) { return <div className="stat"><div className="stat-icon"><Icon>{icon}</Icon></div><div><strong>{value}</strong><span>{label}</span>{change && <small>{change}</small>}</div></div>; }

function Dashboard({ onNavigate }) {
  return <><PageHeader eyebrow="State operations / Overview" title="Civic challenge dashboard" description="A live view of the issues communities are raising across Jharkhand." action={<button className="outline-button" onClick={() => onNavigate('/map')}><Icon>map</Icon> Open live map</button>} />
    <section className="stats-grid"><Stat value="1,284" label="Total challenges" change="↑ 8.4% this month" icon="inbox" /><Stat value="342" label="Awaiting review" change="Needs attention" icon="rate_review" /><Stat value="76%" label="Resolution rate" change="↑ 4.2% this quarter" icon="verified" /><Stat value="18" label="Districts active" change="Across the state" icon="location_on" /></section>
    <section className="dashboard-grid"><div className="panel table-panel"><div className="panel-head"><div><span className="eyebrow">Needs attention</span><h2>Recent civic challenges</h2></div><button className="text-button" onClick={() => onNavigate('/report')}>View all <Icon>arrow_forward</Icon></button></div><div className="table-wrap"><table><thead><tr><th>ID</th><th>Challenge</th><th>Category</th><th>District</th><th>Status</th></tr></thead><tbody>{challenges.map(row => <tr key={row[0]}><td className="mono">{row[0]}</td><td><b>{row[1]}</b><small>Updated 2 hours ago</small></td><td>{row[2]}</td><td>{row[3]}</td><td><Status>{row[4]}</Status></td></tr>)}</tbody></table></div></div><div className="panel distribution"><div className="panel-head"><div><span className="eyebrow">Open data</span><h2>Challenge distribution</h2></div><Icon>more_horiz</Icon></div><div className="donut"><div><strong>1,284</strong><span>total reports</span></div></div><div className="legend"><span><i className="dot blue" />Infrastructure <b>38%</b></span><span><i className="dot cyan" />Water &amp; sanitation <b>27%</b></span><span><i className="dot navy" />Public safety <b>19%</b></span><span><i className="dot pale" />Other <b>16%</b></span></div></div></section>
  </>;
}

function useIssueConditionTickets() {
  const [state, setState] = useState({ tickets: [], isLoading: true, error: '' });
  useEffect(() => {
    let isMounted = true;
    fetchIssueConditionDetails().then(details => {
      if (!isMounted) return;
      setState({
        isLoading: false,
        error: '',
        tickets: details.map((issue, index) => ({
          id: issue.ISSUEID || `ISSUE-${index + 1}`,
          title: `${issue.category || 'Civic issue'} cluster`,
          category: issue.category || 'Uncategorized',
          district: `${Number(issue.latitude).toFixed(5)}, ${Number(issue.longitude).toFixed(5)}`,
          priority: `${Math.round(Number(issue.weight || 0) * 100)}%`,
          posted: 'Live from issuecond',
          skills: `${issue.issues || 0} clustered reports`,
          applicants: 0,
        })),
      });
    }).catch(error => {
      if (isMounted) setState({ tickets: [], isLoading: false, error: error instanceof Error ? error.message : 'Unable to load clustered issues.' });
    });
    return () => { isMounted = false; };
  }, []);
  return state;
}

function TicketsPage() {
  const { tickets, isLoading, error } = useIssueConditionTickets();
  const activeTickets = tickets;
  const [accepted, setAccepted] = useState([]);
  const acceptTicket = id => setAccepted(current => current.includes(id) ? current : [...current, id]);
  return <><PageHeader eyebrow="University collaboration / Ticket queue" title="Active tickets" description="Help move verified civic challenges from the queue into university-led solutions." action={<button className="outline-button"><Icon>filter_alt</Icon> Filter tickets</button>} />
    <div className="ticket-summary-bar"><div><strong>{activeTickets.length - accepted.length}</strong><span>tickets open for acceptance</span></div><div><strong>{accepted.length}</strong><span>accepted by your institution</span></div><div className="ticket-note"><Icon>info</Icon><span>Accept a ticket to start a collaboration request with the state operations team.</span></div></div>
    <section className="ticket-layout"><div className="panel ticket-list"><div className="panel-head"><div><span className="eyebrow">Open collaboration requests</span><h2>Find a challenge to solve</h2></div><span className="count-badge">{activeTickets.length} active</span></div>{activeTickets.map(ticket => { const isAccepted = accepted.includes(ticket.id); return <article className={`ticket-row ${isAccepted ? 'accepted' : ''}`} key={ticket.id}><div className="ticket-icon"><Icon>confirmation_number</Icon></div><div className="ticket-info"><div className="ticket-row-head"><span className="mono">{ticket.id}</span><Status>{ticket.priority}</Status></div><h3>{ticket.title}</h3><div className="ticket-meta"><span><Icon>category</Icon>{ticket.category}</span><span><Icon>location_on</Icon>{ticket.district} District</span><span><Icon>schedule</Icon>Posted {ticket.posted}</span></div><p><Icon>psychology</Icon>{ticket.skills}</p></div><div className="ticket-action"><small>{ticket.applicants} universities interested</small><button className={isAccepted ? 'accepted-button' : 'primary-button'} onClick={() => acceptTicket(ticket.id)} disabled={isAccepted}>{isAccepted ? <><Icon>check_circle</Icon> Accepted</> : <><Icon>handshake</Icon> Accept ticket</>}</button></div></article>; })}</div><aside className="panel university-side-card"><div className="university-mark"><Icon>school</Icon></div><span className="eyebrow">For university teams</span><h2>Build civic impact</h2><p>Accepted tickets appear in your institution workspace, where you can add researchers, propose a solution, and share progress with district officers.</p><div className="side-step"><span>1</span><div><b>Accept a ticket</b><small>Claim a challenge that matches your expertise.</small></div></div><div className="side-step"><span>2</span><div><b>Form your team</b><small>Invite faculty, students, and partner labs.</small></div></div><div className="side-step"><span>3</span><div><b>Submit a proposal</b><small>Share a scoped plan with the state.</small></div></div><button className="text-button">View my accepted tickets <Icon>arrow_forward</Icon></button></aside></section>
  </>;
}

function getHeatmapColor(weight, maximumWeight) {
  const intensity = maximumWeight ? weight / maximumWeight : 0;
  if (intensity >= 0.8) return '#d33a35';
  if (intensity >= 0.6) return '#f0a32e';
  if (intensity >= 0.4) return '#20a6a6';
  return '#2170e4';
}

function JharkhandHeatmap({ onPointsLoaded }) {
  const mapElement = useRef(null);
  const onPointsLoadedRef = useRef(onPointsLoaded);
  onPointsLoadedRef.current = onPointsLoaded;

  useEffect(() => {
    const map = L.map(mapElement.current, { zoomControl: true }).setView([23.6, 85.6], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const loadHeatmapPoints = async () => {
      try {
        if (SUPABASE_URL === 'SUPABASE_URL' || SUPABASE_KEY === 'SUPABASE_KEY') {
          throw new Error('Supabase environment variables are not configured.');
        }
        const response = await fetch(`${SUPABASE_URL}/rest/v1/issuecond?select=issue_details`, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Accept: 'application/json',
          },
        });
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Supabase request failed (${response.status}): ${errorBody}`);
        }
        const rows = await response.json();
        const points = rows.map(row => {
          const details = typeof row.issue_details === 'string' ? JSON.parse(row.issue_details) : row.issue_details;
          return {
            name: details.category || details.name || details.district || details.ISSUEID || 'Civic issue',
            latitude: Number(details.latitude),
            longitude: Number(details.longitude),
            weight: Number(details.weight),
          };
        }).filter(point => Number.isFinite(point.latitude) && Number.isFinite(point.longitude) && Number.isFinite(point.weight));
        const maximumWeight = Math.max(...points.map(point => point.weight), 0);
        onPointsLoadedRef.current(points);
        if (points.length) {
          map.fitBounds(L.latLngBounds(points.map(point => [point.latitude, point.longitude])), { padding: [30, 30], maxZoom: 10 });
        }
        points.forEach(point => {
          const color = getHeatmapColor(point.weight, maximumWeight);
          L.circle([point.latitude, point.longitude], {
            radius: 300 + point.weight * 55,
            color,
            fillColor: color,
            fillOpacity: 0.58,
            opacity: 0.9,
            weight: 2,
          }).bindTooltip(`${point.name}: weight ${point.weight}`, { direction: 'top' }).addTo(map);
        });
      } catch (requestError) {
        console.error('Unable to load heatmap data:', requestError);
        onPointsLoadedRef.current([], requestError instanceof Error ? requestError.message : 'Unable to load heatmap data.');
      }
    };

    loadHeatmapPoints();

    return () => map.remove();
  }, []);

  return <div ref={mapElement} className="map-canvas heatmap-canvas" aria-label="Jharkhand civic challenge heatmap" />;
}

function MapPage() {
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [heatmapError, setHeatmapError] = useState('');
  const handlePointsLoaded = (points, errorMessage = '') => { setHeatmapPoints(points); setHeatmapError(errorMessage); };
  return <><PageHeader eyebrow="Geospatial problem map" title="Live challenge map" description="Locate, filter, and prioritize civic issues by district." action={<button className="primary-button"><Icon>download</Icon> Export data</button>} /><div className="map-toolbar"><button className="filter-active"><Icon>layers</Icon> All challenges</button><button><Icon>filter_alt</Icon> Filter by category</button><button><Icon>calendar_month</Icon> Last 30 days</button></div><section className="map-layout"><div><JharkhandHeatmap onPointsLoaded={handlePointsLoaded} />{heatmapError && <div className="error-message"><Icon>error</Icon>{heatmapError}</div>}<div className="heatmap-legend"><span><i className="legend-dot low" />Lower weight</span><span><i className="legend-dot medium" />Medium</span><span><i className="legend-dot high" />Higher weight</span></div></div><aside className="map-sidebar panel"><div className="panel-head"><div><span className="eyebrow">Live view</span><h2>Priority areas</h2></div><strong className="live-dot">LIVE</strong></div>{heatmapPoints.slice().sort((first, second) => second.weight - first.weight).slice(0, 3).map((point, index) => <div className="area-row" key={`${point.latitude}-${point.longitude}`}><span className={`priority p${index + 1}`}>{index + 1}</span><span><b>{point.name}</b><small>weight {point.weight}</small></span><Icon>chevron_right</Icon></div>)}</aside></section></>;
}

function LegacyReportPage() {
  const [problemText, setProblemText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const submitReport = async event => {
    event.preventDefault();
    if (!coordinates) {
      setError('Please select your location on the map before continuing.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch(`${URL}predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: problemText }),
      });
      const responseText = await response.text();
      let responseValue;
      try { responseValue = JSON.parse(responseText); } catch { responseValue = responseText; }
      if (!response.ok) throw new Error(typeof responseValue === 'string' ? responseValue : JSON.stringify(responseValue));
      setResult(responseValue);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reach the prediction service.');
    } finally {
      setIsLoading(false);
    }
  };

  return <><PageHeader eyebrow="Citizen services / New report" title="Report a civic issue" description="Your report helps improve Jharkhand. Let's gather the details." /><div className="progress"><span className="filled" /><span className="progress-label active">1 Initial details</span><span className="progress-label">2 AI refinement</span><span className="progress-label">3 Review &amp; submit</span></div><section className="report-grid"><form className="panel form-panel" onSubmit={submitReport}><div className="panel-head"><div><span className="eyebrow">Step 1 of 3</span><h2>Issue details</h2></div><span className="required">* Required fields</span></div><label>Issue title<input required placeholder="e.g. Severe potholes on Main Road" /></label><div className="two-col"><label>Category<select required defaultValue=""><option value="" disabled>Select a category</option><option>Infrastructure &amp; Roads</option><option>Water Supply</option><option>Sanitation &amp; Waste</option><option>Electricity</option></select></label><label>Location<input required placeholder="e.g. Ranchi, Hinoo Area" /></label></div><label>Description <textarea required rows="5" value={problemText} onChange={event => setProblemText(event.target.value)} placeholder="Briefly describe the issue..." /></label><label>Photo evidence <div className="upload"><Icon>add_a_photo</Icon><b>Click to upload</b><span>or drag and drop images here</span></div></label><div className="form-actions"><button type="button" className="outline-button">Save draft</button><button className="primary-button" type="submit" disabled={isLoading}>{isLoading ? 'Checking...' : <>Continue to refinement <Icon>arrow_forward</Icon></>}</button></div>{error && <div className="error-message"><Icon>error</Icon>{error}</div>}{result !== null && <div className="prediction-result"><strong>Predicted category</strong><span>{result?.category || 'No category returned'}</span></div>}</form><aside className="ai-card"><div className="ai-orb"><Icon>auto_awesome</Icon></div><span className="eyebrow">Powered by Sahyog AI</span><h2>AI Problem Refiner</h2><p>I'll help structure your report for faster government action by asking a few clarifying questions.</p><div className="ai-question"><Icon>lightbulb</Icon><div><b>Tip</b><span>Specific landmarks and nearby areas help field teams respond faster.</span></div></div></aside></section></> }

function ReportPage() {
  const [problemText, setProblemText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const submitReport = async event => {
    event.preventDefault();
    if (!coordinates) {
      setError('Please select your location on the map before continuing.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError('');
    try {
      const predictionResponse = await fetch(`${URL}predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: problemText }),
      });
      const predictionOutput = await predictionResponse.text();
      if (!predictionResponse.ok) throw new Error(predictionOutput || 'Unable to classify the report.');
      let predictionValue;
      try { predictionValue = JSON.parse(predictionOutput); } catch { predictionValue = predictionOutput; }
      const predictedDescription = typeof predictionValue === 'string'
        ? predictionValue
        : predictionValue?.category || predictionOutput;

      const response = await fetch(`${URL}issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          description: predictedDescription,
        }),
      });
      console.log(predictedDescription)
      const responseText = await response.text();
      let responseValue;
      try { responseValue = JSON.parse(responseText); } catch { responseValue = responseText; }
      if (!response.ok) throw new Error(typeof responseValue === 'string' ? responseValue : JSON.stringify(responseValue));
      setResult(predictionValue);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reach the prediction service.');
    } finally {
      setIsLoading(false);
    }
  };

  return <><PageHeader eyebrow="Citizen services / New report" title="Report a civic issue" description="Your report helps improve Jharkhand. Let's gather the details." /><div className="progress"><span className="filled" /><span className="progress-label active">1 Initial details</span><span className="progress-label">2 AI refinement</span><span className="progress-label">3 Review &amp; submit</span></div><section className="report-grid"><form className="panel form-panel" onSubmit={submitReport}><div className="panel-head"><div><span className="eyebrow">Step 1 of 3</span><h2>Issue details</h2></div><span className="required">* Required fields</span></div><label>Issue title<input required placeholder="e.g. Severe potholes on Main Road" /></label><label>Location <LocationPicker onSelect={setCoordinates} />{coordinates && <span className="selected-coordinates">Selected: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}</span>}</label><label>Description <textarea required rows="5" value={problemText} onChange={event => setProblemText(event.target.value)} placeholder="Briefly describe the issue..." /></label><label>Photo evidence <div className="upload"><Icon>add_a_photo</Icon><b>{selectedFile ? selectedFile.name : 'Click to upload'}</b><span>{selectedFile ? 'Image selected' : 'Choose an image from your device'}</span><input type="file" accept="image/*" onChange={event => setSelectedFile(event.target.files[0] || null)} /></div></label><div className="form-actions"><button type="button" className="outline-button">Save draft</button><button className="primary-button" type="submit" disabled={isLoading}>{isLoading ? 'Checking...' : <>Continue to refinement <Icon>arrow_forward</Icon></>}</button></div>{error && <div className="error-message"><Icon>error</Icon>{error}</div>}{result !== null && <div className="prediction-result"><strong>Predicted category</strong><span>{result?.category || 'No category returned'}</span></div>}</form><aside className="ai-card"><div className="ai-orb"><Icon>auto_awesome</Icon></div><span className="eyebrow">Powered by Sahyog AI</span><h2>AI Problem Refiner</h2><p>I'll help structure your report for faster government action by asking a few clarifying questions.</p><div className="ai-question"><Icon>lightbulb</Icon><div><b>Tip</b><span>Specific landmarks and nearby areas help field teams respond faster.</span></div></div></aside></section></>;
}

function UniversityPage() { return <><div className="research-hero"><div><span className="eyebrow light">State R&amp;D Directorate</span><h1>University Hub</h1><p>Match real civic challenges with the research teams equipped to solve them.</p></div><div className="hero-metric"><strong>48</strong><span>active research teams</span></div></div><PageHeader eyebrow="Jharkhand Academic Network" title="Find the right expertise" description="Browse verified labs and open challenge briefs across the state." action={<button className="outline-button"><Icon>tune</Icon> Match filters</button>} /><div className="hub-grid"><section className="panel"><div className="panel-head"><h2>Open challenge briefs</h2><span className="count-badge">24 matches</span></div>{['Low-cost water quality sensors', 'Climate-resilient rural roads', 'Waste-to-value pilot program'].map((x, i) => <div className="brief" key={x}><span className="brief-icon"><Icon>{['water_drop', 'route', 'recycling'][i]}</Icon></span><div><b>{x}</b><span>{['BIT Mesra · Water Systems Lab', 'IIT (ISM) Dhanbad · Civil Engineering', 'XLRI Jamshedpur · Social Innovation'][i]}</span><small>{[12, 8, 5][i]} teams interested</small></div><Icon>arrow_forward</Icon></div>)}</section><section className="panel match-panel"><span className="eyebrow">Quick match</span><h2>What are you working on?</h2><p>Tell us the capability you need and we will surface relevant institutions.</p><select defaultValue=""><option value="" disabled>Select a research area</option><option>Environmental engineering</option><option>Data and GIS</option><option>Social policy</option></select><button className="primary-button">Find research teams <Icon>search</Icon></button></section></div></> }

function ActivityPage() { return <><PageHeader eyebrow="Audit trail / Ticket CH-26043" title="Activity log" description="A transparent record of every action taken on this challenge." action={<Status>In Progress</Status>} /><section className="activity-layout"><div className="panel activity-card"><div className="ticket-summary"><span className="eyebrow">CH-26043 · Infrastructure</span><h2>Severe potholes on Main Road</h2><p>Reported by Anil Kumar · Ranchi Municipal Area</p></div>{[['Resolved', 'Field work completed and road surface restored.', 'Today, 10:42 AM', 'verified'], ['Assigned', 'Assigned to Ranchi Municipal Corporation field team.', 'Yesterday, 3:15 PM', 'assignment'], ['Under Review', 'Report verified by the district operations desk.', '12 Jun 2025, 9:20 AM', 'rate_review'], ['Submitted', 'Issue submitted through Jharkhand Samadhan.', '11 Jun 2025, 6:48 PM', 'send']].map((event, i) => <div className={`timeline-event ${i === 0 ? 'complete' : ''}`} key={event[0]}><div className="timeline-icon"><Icon>{event[3]}</Icon></div><div><div className="event-meta"><b>{event[0]}</b><span>{event[2]}</span></div><p>{event[1]}</p>{i === 0 && <button className="text-button">View field evidence <Icon>arrow_forward</Icon></button>}</div></div>)}</div><aside className="panel details-panel"><span className="eyebrow">Challenge details</span><h2>Resolution progress</h2><div className="progress-ring"><strong>100%</strong><span>resolved</span></div><dl><div><dt>District</dt><dd>Ranchi</dd></div><div><dt>Category</dt><dd>Infrastructure</dd></div><div><dt>Priority</dt><dd><Status>Urgent</Status></dd></div><div><dt>Assigned team</dt><dd>RMC Field Ops</dd></div></dl></aside></section></> }

function ImpactPage({ onNavigate }) { return <><div className="impact-hero"><div><span className="eyebrow light">State verified impact · Vol. IV</span><h1>Public impact &amp; resolution case studies</h1><p>An authoritative registry of solutions deployed in partnership between state departments and academic institutions.</p></div><button className="light-button" onClick={() => onNavigate('/story')}><Icon>auto_stories</Icon> Read featured story</button></div><PageHeader eyebrow="Verified resolutions" title="Field deployments" description="Measured outcomes from challenges moved from report to resolution." /><div className="case-grid">{[['Kanke Reservoir Water Supply', 'Ranchi District', '15,000', 'residents reached', 'water_drop'], ['Rural Road Restoration', 'Latehar District', '42 km', 'road restored', 'route'], ['Solar Microgrid Pilot', 'Gumla District', '340', 'households connected', 'wb_sunny']].map((item, i) => <article className="case-card" key={item[0]}><div className={`case-image case-${i}`}><Icon>{item[4]}</Icon><span>VERIFIED IMPACT</span></div><div className="case-content"><span className="eyebrow">{item[1]} · Completed</span><h2>{item[0]}</h2><p>Community-led implementation with transparent reporting and measurable public outcomes.</p><div className="case-stat"><strong>{item[2]}</strong><span>{item[3]}</span></div><button className="text-button" onClick={() => onNavigate('/story')}>View case study <Icon>arrow_forward</Icon></button></div></article>)}</div></> }

function StoryPage({ onNavigate }) { return <div className="story"><button className="back-link" onClick={() => onNavigate('/impact')}><Icon>arrow_back</Icon> Back to impact registry</button><span className="eyebrow">Completed project · Ranchi District · Water management</span><h1>Revitalizing the Kanke Reservoir Water Supply System</h1><p className="story-lede">A collaborative initiative to restore clean water access for 15,000 residents in the Kanke block, utilizing IoT-based monitoring and community-driven maintenance protocols.</p><div className="story-banner"><Icon>water_drop</Icon><div><strong>15,000</strong><span>residents with reliable access</span></div><div><strong>94%</strong><span>reduction in supply complaints</span></div><div><strong>18 mo</strong><span>of verified monitoring</span></div></div><div className="story-body"><article><h2>The original challenge</h2><p>Residents in the Kanke block faced unpredictable water supply and limited visibility into reservoir levels. The issue was first surfaced through the citizen reporting network and verified by district officers.</p><h2>The solution</h2><p>Researchers from BIT Mesra partnered with the Public Health Engineering Department to install low-cost sensors, publish live readings, and train local water committees in preventive maintenance.</p></article><aside className="quote"><Icon>format_quote</Icon><p>“When people can see the data, they become partners in maintaining the solution.”</p><span>Dr. Meera Sinha · Project Lead</span></aside></div></div> }

function App() { const [path, setPath] = useState(window.location.pathname); const navigate = next => { window.history.pushState({}, '', next); setPath(next); window.scrollTo(0, 0); }; window.onpopstate = () => setPath(window.location.pathname); let content; if (path === '/map') content = <MapPage />; else if (path === '/tickets') content = <TicketsPage />; else if (path === '/report') content = <ReportPage />; else if (path === '/university') content = <UniversityPage />; else if (path === '/activity') content = <ActivityPage />; else if (path === '/impact') content = <ImpactPage onNavigate={navigate} />; else if (path === '/story') content = <StoryPage onNavigate={navigate} />; else content = <Dashboard onNavigate={navigate} />; return <Layout path={path === '/story' ? '/impact' : path} onNavigate={navigate}>{content}</Layout>; }

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
