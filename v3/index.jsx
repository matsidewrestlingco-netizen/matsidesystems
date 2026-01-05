import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, X, Monitor, Users, Trophy, Clock } from 'lucide-react';

const WrestlingMatchSystem = () => {
  const [view, setView] = useState('home');
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedMat, setSelectedMat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Super admin password
  const ADMIN_PASSWORD = 'matside2026';

  // Load events from persistent storage on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const result = await window.storage.get('wrestling-events');
        if (result && result.value) {
          const loadedEvents = JSON.parse(result.value);
          setEvents(loadedEvents);
        }
      } catch (error) {
        console.log('No previous events found');
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Save events to persistent storage whenever they change
  useEffect(() => {
    const saveEvents = async () => {
      if (!isLoading && events.length > 0) {
        try {
          await window.storage.set('wrestling-events', JSON.stringify(events));
        } catch (error) {
          console.error('Error saving events:', error);
        }
      }
    };
    saveEvents();
  }, [events, isLoading]);

  // Update events array when currentEvent changes
  useEffect(() => {
    if (currentEvent) {
      setEvents(prevEvents => {
        const index = prevEvents.findIndex(e => e.id === currentEvent.id);
        if (index >= 0) {
          const newEvents = [...prevEvents];
          newEvents[index] = currentEvent;
          return newEvents;
        }
        return prevEvents;
      });
    }
  }, [currentEvent]);

  // Home View - Event Selection
  const HomeView = () => (
    <div className="min-h-screen bg-[#000000] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <img 
            src="https://www.matsidesystems.com/assets/Asset%206MSS.png" 
            alt="Matside Systems" 
            className="h-32 mx-auto mb-6"
          />
          <h1 className="text-6xl font-black mb-4 tracking-tight text-white">
            MATSIDE SYSTEMS
          </h1>
          <p className="text-gray-400 text-lg">Digital Management for Match Nights</p>
        </div>

        {/* Create New Event Button */}
        <div className="mb-8">
          <button
            onClick={() => setView('setup')}
            className="w-full bg-[#1e293b] hover:bg-[#334155] p-6 rounded-2xl transition-all transform hover:scale-105 shadow-2xl border border-[#475569] flex items-center justify-center gap-3"
          >
            <Plus className="w-8 h-8" />
            <span className="text-2xl font-bold">Create New Event</span>
          </button>
        </div>

        {/* Events List */}
        {events.length > 0 ? (
          <div>
            <h2 className="text-3xl font-black mb-6">Your Events</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#0f172a] p-6 rounded-2xl border border-[#334155] hover:border-[#475569] transition"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-400">
                      {event.date && (
                        <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                      )}
                      {event.startTime && (
                        <div>🕐 {event.startTime}</div>
                      )}
                      {event.location && (
                        <div>📍 {event.location}</div>
                      )}
                      {event.contactName && (
                        <div>👤 {event.contactName}</div>
                      )}
                    </div>
                    <div className="mt-3 flex gap-4 text-sm">
                      <span className="text-gray-400">{event.mats} mats</span>
                      <span className="text-gray-400">{event.wrestlers?.length || 0} wrestlers</span>
                      <span className="text-gray-400">{event.matches?.length || 0} matches</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setCurrentEvent(event);
                        setView('admin');
                      }}
                      className="bg-[#1e293b] hover:bg-[#334155] p-4 rounded-xl transition border border-[#475569] flex items-center justify-center gap-2"
                    >
                      <Users className="w-5 h-5" />
                      <span className="font-bold">Admin Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentEvent(event);
                        setView('spectator');
                      }}
                      className="bg-[#1e293b] hover:bg-[#334155] p-4 rounded-xl transition border border-[#475569] flex items-center justify-center gap-2"
                    >
                      <Monitor className="w-5 h-5" />
                      <span className="font-bold">Spectator View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#0f172a] rounded-2xl p-12 text-center border border-[#334155]">
            <h3 className="text-2xl font-bold mb-2 text-gray-400">No Events Yet</h3>
            <p className="text-gray-500">Create your first event to get started!</p>
          </div>
        )}

        {/* Super Admin Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => setView('superadmin')}
            className="text-gray-600 hover:text-gray-400 text-sm transition"
          >
            Super Admin
          </button>
        </div>
      </div>
    </div>
  );

  // Event Setup View
  const EventSetupView = () => {
    const [eventName, setEventName] = useState('');
    const [numMats, setNumMats] = useState(2);
    const [matchType, setMatchType] = useState('hs');
    const [eventDate, setEventDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [location, setLocation] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactEmail, setContactEmail] = useState('');

    const matchConfigs = {
      elementary: { name: 'Elementary', periods: 3, periodLength: 60 },
      middle: { name: 'Middle School', periods: 3, periodLength: 90 },
      hs: { name: 'High School', periods: 3, periodLength: 120 }
    };

    const createEvent = () => {
      const newEvent = {
        id: Date.now(),
        name: eventName || 'Match Night',
        mats: numMats,
        matchConfig: matchConfigs[matchType],
        date: eventDate,
        startTime: startTime,
        location: location,
        contactName: contactName,
        contactPhone: contactPhone,
        contactEmail: contactEmail,
        wrestlers: [],
        matches: [],
        createdAt: new Date().toISOString()
      };
      setEvents([...events, newEvent]);
      setCurrentEvent(newEvent);
      setView('admin');
    };

    return (
      <div className="min-h-screen bg-[#000000] text-white p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setView('home')}
            className="mb-8 text-gray-400 hover:text-white transition"
          >
            ← Back to Home
          </button>

          <div className="bg-[#0f172a] rounded-3xl p-8 shadow-2xl border border-[#334155]">
            <h1 className="text-4xl font-black mb-8 text-white">
              Create New Event
            </h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Event Name *</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g., Winter Dual Meet"
                  style={{ backgroundColor: "#080c15", color: "#ffffff" }} className="w-full border-2 border-[#1e293b] rounded-xl px-4 py-3 placeholder-gray-500 focus:border-[#475569] focus:outline-none transition"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">Event Date *</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    style={{ backgroundColor: "#080c15", color: "#ffffff" }} className="w-full border-2 border-[#1e293b] rounded-xl px-4 py-3 focus:border-[#475569] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">Start Time *</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{ backgroundColor: "#080c15", color: "#ffffff" }} className="w-full border-2 border-[#1e293b] rounded-xl px-4 py-3 focus:border-[#475569] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Location Address</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., 123 Main St, Pittsburgh, PA 15120"
                  style={{ backgroundColor: "#080c15", color: "#ffffff" }} className="w-full border-2 border-[#1e293b] rounded-xl px-4 py-3 placeholder-gray-500 focus:border-[#475569] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Contact Person</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g., John Smith"
                  style={{ backgroundColor: "#080c15", color: "#ffffff" }} className="w-full border-2 border-[#1e293b] rounded-xl px-4 py-3 placeholder-gray-500 focus:border-[#475569] focus:outline-none transition"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">Contact Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g., (412) 555-1234"
                    style={{ backgroundColor: "#080c15", color: "#ffffff" }} className="w-full border-2 border-[#1e293b] rounded-xl px-4 py-3 placeholder-gray-500 focus:border-[#475569] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-300">Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g., john@example.com"
                    style={{ backgroundColor: "#080c15", color: "#ffffff" }} className="w-full border-2 border-[#1e293b] rounded-xl px-4 py-3 placeholder-gray-500 focus:border-[#475569] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Number of Mats *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numMats}
                  onChange={(e) => setNumMats(parseInt(e.target.value))}
                  style={{ backgroundColor: "#080c15", color: "#ffffff" }} className="w-full border-2 border-[#1e293b] rounded-xl px-4 py-3 focus:border-[#475569] focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Match Type *</label>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(matchConfigs).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setMatchType(key)}
                      className={`p-4 rounded-xl transition ${
                        matchType === key
                          ? 'bg-[#334155] border-2 border-white shadow-lg'
                          : 'bg-[#080c15] border-2 border-[#1e293b] hover:border-[#334155]'
                      }`}
                    >
                      <div className={`font-bold mb-1 ${matchType === key ? 'text-white' : 'text-gray-300'}`}>
                        {config.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {config.periods}x{config.periodLength}s
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={createEvent}
                className="w-full bg-[#1e293b] hover:bg-[#334155] py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 shadow-xl border border-[#475569]"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Admin Dashboard View
  const AdminDashboardView = () => {
    const [wrestlers, setWrestlers] = useState(currentEvent?.wrestlers || []);
    const [matches, setMatches] = useState(currentEvent?.matches || []);
    const [newWrestler, setNewWrestler] = useState({ name: '', team: '', weight: '' });
    const [selectedWrestlers, setSelectedWrestlers] = useState([]);
    const [assignMat, setAssignMat] = useState(1);

    // Sync with currentEvent when it changes
    useEffect(() => {
      if (currentEvent) {
        setWrestlers(currentEvent.wrestlers || []);
        setMatches(currentEvent.matches || []);
      }
    }, [currentEvent?.id]);

    const addWrestler = () => {
      if (newWrestler.name && newWrestler.weight) {
        const updatedWrestlers = [...wrestlers, { ...newWrestler, id: Date.now() }];
        setWrestlers(updatedWrestlers);
        // Update the current event
        const updatedEvent = { ...currentEvent, wrestlers: updatedWrestlers };
        setCurrentEvent(updatedEvent);
        setNewWrestler({ name: '', team: '', weight: '' });
      }
    };

    const parseCSV = (text) => {
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        return obj;
      });
    };

    const handleWrestlerCSV = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          const data = parseCSV(text);
          const newWrestlers = data.map(row => ({
            id: Date.now() + Math.random(),
            name: row.name || row.wrestler || '',
            team: row.team || '',
            weight: row.weight || row.weightclass || '',
            division: row.division || ''
          })).filter(w => w.name);
          
          const updatedWrestlers = [...wrestlers, ...newWrestlers];
          setWrestlers(updatedWrestlers);
          const updatedEvent = { ...currentEvent, wrestlers: updatedWrestlers };
          setCurrentEvent(updatedEvent);
        };
        reader.readAsText(file);
      }
      e.target.value = '';
    };

    const handleMatchCSV = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const text = event.target.result;
            console.log('Raw CSV text:', text);
            
            const data = parseCSV(text);
            console.log('Parsed CSV data:', data);
            console.log('Available wrestlers:', wrestlers.map(w => ({ id: w.id, name: w.name })));
            
            if (wrestlers.length === 0) {
              alert('No wrestlers found! Please add wrestlers before uploading matches.');
              return;
            }
            
            const newMatches = [];
            const errors = [];
            
            data.forEach((row, index) => {
              // Try to find wrestlers by name (case insensitive)
              const w1Name = (row.wrestler1 || row.name1 || '').toLowerCase().trim();
              const w2Name = (row.wrestler2 || row.name2 || '').toLowerCase().trim();
              
              console.log(`Row ${index + 1}: Looking for "${w1Name}" and "${w2Name}"`);
              
              const w1 = wrestlers.find(w => w.name.toLowerCase().trim() === w1Name);
              const w2 = wrestlers.find(w => w.name.toLowerCase().trim() === w2Name);
              
              if (!w1) {
                errors.push(`Row ${index + 2}: Could not find wrestler "${row.wrestler1 || row.name1}"`);
              }
              if (!w2) {
                errors.push(`Row ${index + 2}: Could not find wrestler "${row.wrestler2 || row.name2}"`);
              }
              
              if (w1 && w2) {
                newMatches.push({
                  id: Date.now() + Math.random(),
                  wrestler1: w1,
                  wrestler2: w2,
                  mat: parseInt(row.mat) || 1,
                  weight: row.weight || row.weightclass || w1.weight,
                  status: 'pending',
                  result: null
                });
              }
            });
            
            console.log('Created matches:', newMatches);
            console.log('Errors:', errors);
            
            if (errors.length > 0) {
              alert(`Errors found:\n${errors.join('\n')}\n\nCreated ${newMatches.length} match(es) successfully.`);
            }
            
            if (newMatches.length === 0) {
              alert('No matches could be created. Make sure:\n1. You have wrestlers added\n2. Wrestler names in CSV match exactly (case-insensitive)\n3. CSV has columns: wrestler1, wrestler2, mat, weight');
            } else {
              const updatedMatches = [...matches, ...newMatches];
              setMatches(updatedMatches);
              const updatedEvent = { ...currentEvent, matches: updatedMatches };
              setCurrentEvent(updatedEvent);
              alert(`Successfully created ${newMatches.length} match(es)!`);
            }
          } catch (error) {
            console.error('Error parsing CSV:', error);
            alert(`Error parsing CSV file: ${error.message}\n\nPlease check the format.`);
          }
        };
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
          alert('Error reading file. Please try again.');
        };
        reader.readAsText(file);
      }
      e.target.value = '';
    };

    const deleteMatch = (matchId) => {
      const updatedMatches = matches.filter(m => m.id !== matchId);
      setMatches(updatedMatches);
      const updatedEvent = { ...currentEvent, matches: updatedMatches };
      setCurrentEvent(updatedEvent);
    };

    const handleCombinedCSV = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const text = event.target.result;
            const data = parseCSV(text);
            console.log('Parsed combined CSV:', data);
            
            // Extract unique wrestlers from both red and green sides
            const wrestlerMap = new Map();
            
            data.forEach(row => {
              // Add red wrestler
              if (row.redname && row.redteam) {
                const key = `${row.redname.trim()}-${row.redteam.trim()}`;
                if (!wrestlerMap.has(key)) {
                  wrestlerMap.set(key, {
                    id: Date.now() + Math.random(),
                    name: row.redname.trim(),
                    team: row.redteam.trim(),
                    weight: row.weight || ''
                  });
                }
              }
              
              // Add green wrestler
              if (row.greenname && row.greenteam) {
                const key = `${row.greenname.trim()}-${row.greenteam.trim()}`;
                if (!wrestlerMap.has(key)) {
                  wrestlerMap.set(key, {
                    id: Date.now() + Math.random(),
                    name: row.greenname.trim(),
                    team: row.greenteam.trim(),
                    weight: row.weight || ''
                  });
                }
              }
            });
            
            const newWrestlers = Array.from(wrestlerMap.values());
            console.log('Extracted wrestlers:', newWrestlers);
            
            // Create matches
            const newMatches = data.map(row => {
              const w1 = newWrestlers.find(w => 
                w.name.toLowerCase() === (row.redname || '').trim().toLowerCase() &&
                w.team.toLowerCase() === (row.redteam || '').trim().toLowerCase()
              );
              const w2 = newWrestlers.find(w => 
                w.name.toLowerCase() === (row.greenname || '').trim().toLowerCase() &&
                w.team.toLowerCase() === (row.greenteam || '').trim().toLowerCase()
              );
              
              if (w1 && w2) {
                return {
                  id: Date.now() + Math.random(),
                  wrestler1: w1,
                  wrestler2: w2,
                  mat: parseInt(row.mat) || 1,
                  weight: row.weight || '',
                  status: 'pending',
                  result: null
                };
              }
              return null;
            }).filter(m => m !== null);
            
            console.log('Created matches:', newMatches);
            
            // Update state
            const updatedWrestlers = [...wrestlers, ...newWrestlers];
            const updatedMatches = [...matches, ...newMatches];
            
            setWrestlers(updatedWrestlers);
            setMatches(updatedMatches);
            
            const updatedEvent = {
              ...currentEvent,
              wrestlers: updatedWrestlers,
              matches: updatedMatches
            };
            setCurrentEvent(updatedEvent);
            
            alert(`Success!\nAdded ${newWrestlers.length} wrestlers\nCreated ${newMatches.length} matches`);
          } catch (error) {
            console.error('Error parsing CSV:', error);
            alert(`Error: ${error.message}`);
          }
        };
        reader.readAsText(file);
      }
      e.target.value = '';
    };

    const createMatch = () => {
      if (selectedWrestlers.length === 2) {
        const newMatch = {
          id: Date.now(),
          wrestler1: wrestlers.find(w => w.id === selectedWrestlers[0]),
          wrestler2: wrestlers.find(w => w.id === selectedWrestlers[1]),
          mat: assignMat,
          weight: wrestlers.find(w => w.id === selectedWrestlers[0]).weight,
          status: 'pending',
          result: null
        };
        const updatedMatches = [...matches, newMatch];
        setMatches(updatedMatches);
        // Update the current event
        const updatedEvent = { ...currentEvent, matches: updatedMatches };
        setCurrentEvent(updatedEvent);
        setSelectedWrestlers([]);
      }
    };

    const matMatches = Array.from({ length: currentEvent?.mats || 1 }, (_, i) => i + 1).map(matNum => ({
      matNum,
      matches: matches.filter(m => m.mat === matNum)
    }));

    return (
      <div className="min-h-screen bg-[#000000] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setView('home')}
            className="mb-8 text-slate-400 hover:text-white transition"
          >
            ← Back to Home
          </button>

          <h1 className="text-5xl font-black mb-8 text-white">
            Admin Dashboard
          </h1>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Add Wrestlers */}
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155]">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Upload Matches
              </h2>
              
              {/* Combined CSV Upload */}
              <div className="mb-4">
                <label className="block w-full bg-[#1e293b] hover:bg-[#334155] border border-[#475569] py-3 rounded-lg font-bold transition text-center cursor-pointer">
                  📄 Upload Match CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCombinedCSV}
                    className="hidden"
                  />
                </label>
                <div className="text-xs text-gray-400 mt-2 space-y-1">
                  <p>CSV columns: bout, weight, redName, redTeam, greenName, greenTeam, round, mat</p>
                  <p className="text-gray-500">This will automatically create wrestlers and matches</p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4 mb-4"></div>

              <h3 className="text-lg font-bold mb-3">Or Add Wrestler Manually</h3>

              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Wrestler Name"
                  value={newWrestler.name}
                  onChange={(e) => setNewWrestler({ ...newWrestler, name: e.target.value })}
                  className="w-full bg-[#0f172a] border-2 border-slate-700 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Team"
                  value={newWrestler.team}
                  onChange={(e) => setNewWrestler({ ...newWrestler, team: e.target.value })}
                  className="w-full bg-[#0f172a] border-2 border-slate-700 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Weight Class"
                  value={newWrestler.weight}
                  onChange={(e) => setNewWrestler({ ...newWrestler, weight: e.target.value })}
                  className="w-full bg-[#0f172a] border-2 border-slate-700 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                />
                <button
                  onClick={addWrestler}
                  className="w-full bg-[#1e293b] hover:bg-[#334155] border border-[#475569] py-2 rounded-lg font-bold transition"
                >
                  Add Wrestler
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {wrestlers.map((w) => (
                  <div key={w.id} className="bg-[#0f172a]/50 p-3 rounded-lg flex justify-between items-center border border-[#1e293b]">
                    <div>
                      <div className="font-bold">{w.name}</div>
                      <div className="text-sm text-slate-400">{w.team} • {w.weight} lbs</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedWrestlers.includes(w.id)}
                      onChange={(e) => {
                        if (e.target.checked && selectedWrestlers.length < 2) {
                          setSelectedWrestlers([...selectedWrestlers, w.id]);
                        } else {
                          setSelectedWrestlers(selectedWrestlers.filter(id => id !== w.id));
                        }
                      }}
                      className="w-5 h-5"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Create Matches */}
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155]">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Create Match
              </h2>
              
              {/* CSV Upload for Matches */}
              <div className="mb-4">
                <label className="block w-full bg-[#1e293b] hover:bg-[#334155] border border-[#475569] py-3 rounded-lg font-bold transition text-center cursor-pointer">
                  📄 Upload Matches CSV
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleMatchCSV}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-400 mt-2">CSV columns: wrestler1, wrestler2, mat, weight</p>
              </div>

              <div className="border-t border-slate-700 pt-4 mb-4"></div>

              <div className="space-y-4">
                <div className="bg-[#0f172a]/50 p-4 rounded-lg border border-[#1e293b]">
                  <div className="text-sm text-slate-400 mb-2">Selected Wrestlers ({selectedWrestlers.length}/2)</div>
                  {selectedWrestlers.map(id => {
                    const w = wrestlers.find(wr => wr.id === id);
                    return w ? (
                      <div key={id} className="text-lg font-bold">{w.name} ({w.weight} lbs)</div>
                    ) : null;
                  })}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Assign to Mat</label>
                  <select
                    value={assignMat}
                    onChange={(e) => setAssignMat(parseInt(e.target.value))}
                    className="w-full bg-[#0f172a] border-2 border-slate-700 rounded-lg px-4 py-2 text-white focus:border-pink-500 focus:outline-none"
                  >
                    {Array.from({ length: currentEvent?.mats || 1 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>Mat {num}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={createMatch}
                  disabled={selectedWrestlers.length !== 2}
                  className="w-full bg-[#1e293b] hover:bg-[#334155] border border-[#475569] disabled:from-slate-700 disabled:to-slate-700 py-3 rounded-lg font-bold transition"
                >
                  Create Match
                </button>
              </div>
            </div>
          </div>

          {/* Mat Assignments */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matMatches.map(({ matNum, matches: matMatchList }) => (
              <div key={matNum} className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Mat {matNum}</h3>
                  <button
                    onClick={() => {
                      setSelectedMat(matNum);
                      setView('table');
                    }}
                    className="bg-[#1e293b] hover:bg-[#334155] border border-[#475569] px-4 py-2 rounded-lg text-sm font-bold transition"
                  >
                    Open Table
                  </button>
                </div>
                <div className="space-y-2">
                  {matMatchList.length === 0 ? (
                    <div className="text-slate-500 text-center py-8">No matches assigned</div>
                  ) : (
                    matMatchList.map((match) => (
                      <div key={match.id} className={`p-3 rounded-lg border ${
                        match.status === 'completed' ? 'bg-emerald-900/30 border-[#334155] 700/30' :
                        match.status === 'in-progress' ? 'bg-blue-900/30 border-blue-700/30' :
                        'bg-[#0f172a]/50 border-[#1e293b]'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-bold text-slate-400">{match.weight} lbs</div>
                          {match.status === 'pending' && (
                            <button
                              onClick={() => deleteMatch(match.id)}
                              className="text-red-400 hover:text-red-300 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="font-bold">{match.wrestler1.name}</div>
                        <div className="text-slate-400 text-sm">vs</div>
                        <div className="font-bold">{match.wrestler2.name}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Table Worker Interface
  const TableWorkerView = () => {
    const [time, setTime] = useState(currentEvent?.matchConfig?.periodLength || 120);
    const [isRunning, setIsRunning] = useState(false);
    const [period, setPeriod] = useState(1);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [currentMatch, setCurrentMatch] = useState(null);
    const timerRef = useRef(null);

    // Get pending matches for this mat
    const pendingMatches = (currentEvent?.matches || []).filter(
      m => m.mat === selectedMat && m.status === 'pending'
    );
    
    // Get in-progress match for this mat
    const inProgressMatch = (currentEvent?.matches || []).find(
      m => m.mat === selectedMat && m.status === 'in-progress'
    );

    // If there's an in-progress match and no current match loaded, load it
    useEffect(() => {
      if (inProgressMatch && !currentMatch) {
        setCurrentMatch(inProgressMatch);
      }
    }, [inProgressMatch, currentMatch]);

    useEffect(() => {
      if (isRunning && time > 0) {
        timerRef.current = setInterval(() => {
          setTime(t => Math.max(0, t - 1));
        }, 1000);
      } else {
        clearInterval(timerRef.current);
      }
      return () => clearInterval(timerRef.current);
    }, [isRunning, time]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const addPoints = (wrestler, points) => {
      if (wrestler === 1) setScore1(score1 + points);
      else setScore2(score2 + points);
    };

    const submitMatch = () => {
      if (currentMatch) {
        // Update match with result
        const winner = score1 > score2 ? currentMatch.wrestler1 : currentMatch.wrestler2;
        const updatedMatches = currentEvent.matches.map(m => 
          m.id === currentMatch.id 
            ? { ...m, status: 'completed', result: { winner: winner.name, score1, score2 } }
            : m
        );
        const updatedEvent = { ...currentEvent, matches: updatedMatches };
        setCurrentEvent(updatedEvent);
        
        alert(`Match completed! Winner: ${winner.name} (${Math.max(score1, score2)}-${Math.min(score1, score2)})`);
        setCurrentMatch(null);
        setScore1(0);
        setScore2(0);
        setPeriod(1);
        setTime(currentEvent?.matchConfig?.periodLength || 120);
        setIsRunning(false);
      }
    };

    const loadMatch = (match) => {
      // Check if there's already a match in progress
      if (inProgressMatch && inProgressMatch.id !== match.id) {
        if (!confirm('There is already a match in progress. Loading a new match will reset the current one to pending. Continue?')) {
          return;
        }
        // Reset the in-progress match back to pending
        const resetMatches = currentEvent.matches.map(m => 
          m.id === inProgressMatch.id ? { ...m, status: 'pending' } : m
        );
        const resetEvent = { ...currentEvent, matches: resetMatches };
        setCurrentEvent(resetEvent);
      }

      setCurrentMatch(match);
      setScore1(0);
      setScore2(0);
      setPeriod(1);
      setTime(currentEvent?.matchConfig?.periodLength || 120);
      setIsRunning(false);
      
      // Mark match as in-progress
      const updatedMatches = currentEvent.matches.map(m => 
        m.id === match.id ? { ...m, status: 'in-progress' } : m
      );
      const updatedEvent = { ...currentEvent, matches: updatedMatches };
      setCurrentEvent(updatedEvent);
    };

    return (
      <div className="min-h-screen bg-[#000000] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setView('admin')}
              className="text-slate-400 hover:text-white transition"
            >
              ← Back to Admin
            </button>
            <h1 className="text-4xl font-black">MAT {selectedMat} - TABLE CONTROL</h1>
            <button
              onClick={() => setView('scoreboard')}
              className="bg-[#1e293b] hover:bg-[#334155] border border-[#475569] px-6 py-3 rounded-lg font-bold transition flex items-center gap-2"
            >
              <Monitor className="w-5 h-5" />
              Scoreboard View
            </button>
          </div>

          {!currentMatch ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Pending Bouts List */}
              <div className="lg:col-span-3 bg-[#0f172a] rounded-3xl p-8 border border-[#334155]">
                <h2 className="text-3xl font-bold mb-6">Pending Bouts - Select to Load</h2>
                {pendingMatches.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingMatches.map((match, idx) => (
                      <button
                        key={match.id}
                        onClick={() => loadMatch(match)}
                        className="bg-[#0f172a]/50 hover:bg-[#0f172a] p-6 rounded-2xl text-left transition transform hover:scale-105 border-2 border-slate-700 hover:border-[#334155] 500"
                      >
                        {idx === 0 && (
                          <div className="text-xs font-bold text-white mb-2">⭐ UP NEXT</div>
                        )}
                        <div className="text-sm font-bold text-slate-400 mb-3">{match.weight} lbs</div>
                        <div className="text-xl font-black text-white mb-1">{match.wrestler1.name}</div>
                        <div className="text-xs text-slate-400 mb-2">{match.wrestler1.team}</div>
                        <div className="text-slate-500 text-sm my-2">vs</div>
                        <div className="text-xl font-black text-gray-400 mb-1">{match.wrestler2.name}</div>
                        <div className="text-xs text-slate-400">{match.wrestler2.team}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 text-center py-12 text-xl">No pending matches assigned to this mat</div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Match Info */}
              <div className="bg-[#0f172a]/50 rounded-xl p-4 text-center border border-[#1e293b]">
                <div className="text-sm text-slate-400">Currently Scoring: {currentMatch.weight} lbs</div>
              </div>

              {/* Timer and Period */}
              <div className="bg-[#0f172a] rounded-3xl p-8 text-center border border-[#334155]">
                <div className="text-slate-400 mb-2">Period {period} of {currentEvent?.matchConfig?.periods || 3}</div>
                <div className="text-8xl font-black mb-6 font-mono tracking-tighter">{formatTime(time)}</div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="bg-[#1e293b] hover:bg-[#334155] border border-[#475569] p-4 rounded-xl transition"
                  >
                    {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </button>
                  <button
                    onClick={() => {
                      setTime(currentEvent?.matchConfig?.periodLength || 120);
                      setIsRunning(false);
                    }}
                    className="bg-red-700 hover:bg-red-600 p-4 rounded-xl transition"
                  >
                    <RotateCcw className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => {
                      if (period < (currentEvent?.matchConfig?.periods || 3)) {
                        setPeriod(period + 1);
                        setTime(currentEvent?.matchConfig?.periodLength || 120);
                        setIsRunning(false);
                      }
                    }}
                    className="bg-blue-700 hover:bg-blue-600 px-6 py-4 rounded-xl font-bold transition"
                  >
                    Next Period
                  </button>
                </div>
              </div>

              {/* Scoring */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Wrestler 1 */}
                <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-3xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold mb-2">{currentMatch.wrestler1.name}</div>
                    <div className="text-red-200">{currentMatch.wrestler1.team}</div>
                    <div className="text-8xl font-black mt-4 font-mono">{score1}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => addPoints(1, 1)} className="bg-red-900 hover:bg-red-800 py-4 rounded-xl font-bold text-lg">
                      +1 Escape
                    </button>
                    <button onClick={() => addPoints(1, 3)} className="bg-red-900 hover:bg-red-800 py-4 rounded-xl font-bold text-lg">
                      +3 Takedown
                    </button>
                    <button onClick={() => addPoints(1, 2)} className="bg-red-900 hover:bg-red-800 py-4 rounded-xl font-bold text-lg">
                      +2 Reversal
                    </button>
                    <button onClick={() => addPoints(1, 2)} className="bg-red-900 hover:bg-red-800 py-4 rounded-xl font-bold text-lg">
                      +2 Near Fall
                    </button>
                    <button onClick={() => addPoints(1, 3)} className="bg-red-900 hover:bg-red-800 py-4 rounded-xl font-bold text-lg">
                      +3 Near Fall
                    </button>
                    <button onClick={() => addPoints(1, 4)} className="bg-red-900 hover:bg-red-800 py-4 rounded-xl font-bold text-lg">
                      +4 Near Fall
                    </button>
                  </div>
                </div>

                {/* Wrestler 2 */}
                <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-3xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold mb-2">{currentMatch.wrestler2.name}</div>
                    <div className="text-blue-200">{currentMatch.wrestler2.team}</div>
                    <div className="text-8xl font-black mt-4 font-mono">{score2}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => addPoints(2, 1)} className="bg-blue-900 hover:bg-blue-800 py-4 rounded-xl font-bold text-lg">
                      +1 Escape
                    </button>
                    <button onClick={() => addPoints(2, 3)} className="bg-blue-900 hover:bg-blue-800 py-4 rounded-xl font-bold text-lg">
                      +3 Takedown
                    </button>
                    <button onClick={() => addPoints(2, 2)} className="bg-blue-900 hover:bg-blue-800 py-4 rounded-xl font-bold text-lg">
                      +2 Reversal
                    </button>
                    <button onClick={() => addPoints(2, 2)} className="bg-blue-900 hover:bg-blue-800 py-4 rounded-xl font-bold text-lg">
                      +2 Near Fall
                    </button>
                    <button onClick={() => addPoints(2, 3)} className="bg-blue-900 hover:bg-blue-800 py-4 rounded-xl font-bold text-lg">
                      +3 Near Fall
                    </button>
                    <button onClick={() => addPoints(2, 4)} className="bg-blue-900 hover:bg-blue-800 py-4 rounded-xl font-bold text-lg">
                      +4 Near Fall
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Match */}
              <button
                onClick={submitMatch}
                className="w-full bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 py-6 rounded-2xl font-bold text-2xl transition transform hover:scale-105 shadow-2xl"
              >
                Submit Match Results
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // TV Scoreboard View
  const ScoreboardView = () => {
    const [time] = useState(125);
    const [period] = useState(2);
    const [score1] = useState(7);
    const [score2] = useState(4);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="w-full max-w-7xl">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 border-4 border-amber-500 shadow-2xl">
            <div className="text-center mb-12">
              <div className="text-6xl font-black text-amber-400 mb-4">MAT {selectedMat}</div>
              <div className="text-3xl font-bold text-slate-400">PERIOD {period}</div>
            </div>

            <div className="text-center mb-16">
              <div className="text-9xl font-black font-mono tracking-tight">{formatTime(time)}</div>
            </div>

            <div className="grid grid-cols-2 gap-16">
              <div className="text-center">
                <div className="bg-red-700 rounded-2xl p-8 mb-6">
                  <div className="text-3xl font-bold mb-4">John Smith</div>
                  <div className="text-xl text-red-200 mb-6">Eagles</div>
                  <div className="text-9xl font-black font-mono">{score1}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-blue-700 rounded-2xl p-8 mb-6">
                  <div className="text-3xl font-bold mb-4">Mike Johnson</div>
                  <div className="text-xl text-blue-200 mb-6">Warriors</div>
                  <div className="text-9xl font-black font-mono">{score2}</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12 text-2xl text-slate-400">
              152 lbs Weight Class
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Super Admin View
  const SuperAdminView = () => {
    const [password, setPassword] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    if (!isAdminAuthenticated) {
      return (
        <div className="min-h-screen bg-[#000000] text-white p-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            <button
              onClick={() => setView('home')}
              className="mb-8 text-gray-400 hover:text-white transition"
            >
              ← Back to Home
            </button>
            
            <div className="bg-[#0f172a] rounded-3xl p-8 border border-[#334155]">
              <h1 className="text-3xl font-black mb-6 text-center">Super Admin Access</h1>
              <div className="space-y-4">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password: matside2026"
                  style={{ backgroundColor: '#080c15', color: '#ffffff' }}
                  className="w-full border-2 border-[#1e293b] rounded-xl px-4 py-3 placeholder-gray-500 focus:border-[#475569] focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (password === ADMIN_PASSWORD) {
                      setIsAdminAuthenticated(true);
                    } else {
                      alert('Wrong password');
                    }
                  }}
                  className="w-full bg-[#1e293b] hover:bg-[#334155] py-3 rounded-xl font-bold transition border border-[#475569]"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const deleteEvent = async (eventId) => {
      const updatedEvents = events.filter(e => e.id !== eventId);
      setEvents(updatedEvents);
      setShowDeleteConfirm(null);
      try {
        await window.storage.set('wrestling-events', JSON.stringify(updatedEvents));
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const clearAll = async () => {
      if (confirm('Delete ALL events?')) {
        setEvents([]);
        try {
          await window.storage.delete('wrestling-events');
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    return (
      <div className="min-h-screen bg-[#000000] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => {
              setView('home');
              setIsAdminAuthenticated(false);
            }}
            className="mb-8 text-gray-400 hover:text-white transition"
          >
            ← Back & Logout
          </button>

          <h1 className="text-5xl font-black mb-8">SUPER ADMIN</h1>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155]">
              <div className="text-gray-400 text-sm">Total Events</div>
              <div className="text-4xl font-black">{events.length}</div>
            </div>
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155]">
              <div className="text-gray-400 text-sm">Total Wrestlers</div>
              <div className="text-4xl font-black">
                {events.reduce((sum, e) => sum + (e.wrestlers?.length || 0), 0)}
              </div>
            </div>
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155]">
              <div className="text-gray-400 text-sm">Total Matches</div>
              <div className="text-4xl font-black">
                {events.reduce((sum, e) => sum + (e.matches?.length || 0), 0)}
              </div>
            </div>
            <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155]">
              <div className="text-gray-400 text-sm">Completed</div>
              <div className="text-4xl font-black">
                {events.reduce((sum, e) => sum + (e.matches?.filter(m => m.status === 'completed').length || 0), 0)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155] mb-8">
            <h2 className="text-2xl font-bold mb-4">Actions</h2>
            <button
              onClick={clearAll}
              className="bg-red-900 hover:bg-red-800 px-6 py-3 rounded-xl font-bold transition border border-red-700"
            >
              Clear All Data
            </button>
          </div>

          {/* Events */}
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155]">
            <h2 className="text-2xl font-bold mb-4">Events</h2>
            {events.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No events</div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-[#080c15] rounded-xl p-6 border border-[#1e293b]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                        <div className="text-sm text-gray-400">
                          <div>Wrestlers: {event.wrestlers?.length || 0}</div>
                          <div>Matches: {event.matches?.length || 0}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(event.id)}
                        className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded-lg transition border border-red-700"
                      >
                        Delete
                      </button>
                    </div>
                    
                    {showDeleteConfirm === event.id && (
                      <div className="bg-red-950 border-2 border-red-700 rounded-xl p-4 mt-4">
                        <p className="text-red-200 mb-4">Delete "{event.name}"?</p>
                        <div className="flex gap-4">
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="bg-[#1e293b] hover:bg-[#334155] px-4 py-2 rounded-lg border border-[#475569]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Spectator View
  const SpectatorView = () => {
    const allMatches = currentEvent?.matches || [];
    const matMatches = Array.from({ length: currentEvent?.mats || 1 }, (_, i) => i + 1).map(matNum => ({
      matNum,
      matches: allMatches.filter(m => m.mat === matNum)
    }));

    return (
      <div className="min-h-screen bg-[#000000] text-white p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setView('home')}
            className="mb-8 text-slate-400 hover:text-white transition"
          >
            ← Back to Home
          </button>

          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            UPCOMING MATCHES
          </h1>
          <p className="text-slate-400 mb-8 text-lg">Check when and where your wrestler competes</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matMatches.map(({ matNum, matches }) => (
              <div key={matNum} className="bg-[#0f172a] rounded-2xl p-6 border border-[#334155]">
                <h2 className="text-3xl font-black mb-6 text-white">MAT {matNum}</h2>
                <div className="space-y-4">
                  {matches.length === 0 ? (
                    <div className="text-slate-500 text-center py-8">No matches scheduled</div>
                  ) : (
                    matches.map((match, idx) => (
                      <div key={match.id} className={`p-4 rounded-xl border ${
                        match.status === 'completed' ? 'bg-emerald-900/20 opacity-50 border-[#334155] 800/30' :
                        match.status === 'in-progress' ? 'bg-emerald-600/30 border-2 border-[#334155] 500' :
                        idx === 0 ? 'bg-amber-600/30 border-2 border-amber-500' :
                        'bg-[#0f172a]/50 border-[#1e293b]'
                      }`}>
                        {idx === 0 && match.status === 'pending' && (
                          <div className="text-xs font-bold text-amber-400 mb-2">UP NEXT</div>
                        )}
                        {match.status === 'in-progress' && (
                          <div className="text-xs font-bold text-white mb-2 animate-pulse">IN PROGRESS</div>
                        )}
                        <div className="text-sm font-bold text-slate-400 mb-2">{match.weight} lbs</div>
                        <div className="font-bold text-lg">{match.wrestler1.name}</div>
                        <div className="text-xs text-slate-400">{match.wrestler1.team}</div>
                        <div className="text-slate-500 text-sm my-1">vs</div>
                        <div className="font-bold text-lg">{match.wrestler2.name}</div>
                        <div className="text-xs text-slate-400">{match.wrestler2.team}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Main Router
  return (
    <div className="font-sans antialiased" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      {view === 'home' && <HomeView />}
      {view === 'setup' && <EventSetupView />}
      {view === 'admin' && <AdminDashboardView />}
      {view === 'table' && <TableWorkerView />}
      {view === 'scoreboard' && <ScoreboardView />}
      {view === 'spectator' && <SpectatorView />}
      {view === 'superadmin' && <SuperAdminView />}
    </div>
  );
};

export default WrestlingMatchSystem;
