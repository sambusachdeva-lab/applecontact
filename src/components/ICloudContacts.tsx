import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Star, Phone, MessageSquare, Video, Mail, 
  MapPin, Calendar, Edit3, Trash2, Download, Share2, 
  Users, UserCheck, X, Check, ArrowLeft
} from 'lucide-react';
import { Contact } from '../types';

interface ICloudContactsProps {
  contacts: Contact[];
  onAddContact: (contact: Contact) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onInitiateCall: (name: string, number: string, type: 'phone' | 'facetime') => void;
  onOpenLiveChat: () => void;
}

export const ICloudContacts: React.FC<ICloudContactsProps> = ({
  contacts,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onInitiateCall,
  onOpenLiveChat,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All Contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Form State for Contact Editor
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formJobTitle, setFormJobTitle] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formGroup, setFormGroup] = useState<Contact['group']>('Apple Team');
  const [formIsFavorite, setFormIsFavorite] = useState(false);

  // Groups list
  const groups = [
    'All Contacts',
    'Favorites',
    'Apple Team',
    'Family',
    'Work',
    'Friends',
    'Services',
  ];

  // Filtering
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // Group filter
      if (selectedGroup === 'Favorites') {
        if (!c.isFavorite) return false;
      } else if (selectedGroup !== 'All Contacts') {
        if (c.group !== selectedGroup) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
        const comp = (c.company || '').toLowerCase();
        const phoneMatch = c.phoneNumbers.some((p) => p.number.includes(query));
        const emailMatch = c.emails.some((e) => e.email.toLowerCase().includes(query));
        return fullName.includes(query) || comp.includes(query) || phoneMatch || emailMatch;
      }

      return true;
    }).sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
  }, [contacts, selectedGroup, searchQuery]);

  // Active selected contact
  const activeContact = contacts.find((c) => c.id === selectedContactId) || filteredContacts[0];

  // Open editor for new contact
  const handleOpenNewContact = () => {
    setIsEditingExisting(false);
    setFormFirstName('');
    setFormLastName('');
    setFormCompany('');
    setFormJobTitle('');
    setFormPhone('');
    setFormEmail('');
    setFormStreet('');
    setFormCity('');
    setFormNotes('');
    setFormGroup('Apple Team');
    setFormIsFavorite(false);
    setIsEditorOpen(true);
  };

  // Open editor for existing contact
  const handleOpenEditContact = (c: Contact) => {
    setIsEditingExisting(true);
    setFormFirstName(c.firstName);
    setFormLastName(c.lastName);
    setFormCompany(c.company || '');
    setFormJobTitle(c.jobTitle || '');
    setFormPhone(c.phoneNumbers[0]?.number || '');
    setFormEmail(c.emails[0]?.email || '');
    setFormStreet(c.addresses?.[0]?.street || '');
    setFormCity(c.addresses?.[0]?.city || '');
    setFormNotes(c.notes || '');
    setFormGroup(c.group);
    setFormIsFavorite(!!c.isFavorite);
    setIsEditorOpen(true);
  };

  // Save Contact
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName && !formLastName) return;

    if (isEditingExisting && activeContact) {
      const updated: Contact = {
        ...activeContact,
        firstName: formFirstName,
        lastName: formLastName,
        company: formCompany || undefined,
        jobTitle: formJobTitle || undefined,
        phoneNumbers: formPhone ? [{ type: 'mobile', number: formPhone }] : activeContact.phoneNumbers,
        emails: formEmail ? [{ type: 'work', email: formEmail }] : activeContact.emails,
        addresses: formStreet
          ? [{ type: 'work', street: formStreet, city: formCity, state: '', zip: '', country: 'USA' }]
          : activeContact.addresses,
        notes: formNotes || undefined,
        group: formGroup,
        isFavorite: formIsFavorite,
      };
      onUpdateContact(updated);
    } else {
      const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-rose-600', 'bg-emerald-600', 'bg-amber-600'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newContact: Contact = {
        id: `contact-${Date.now()}`,
        firstName: formFirstName,
        lastName: formLastName,
        company: formCompany || undefined,
        jobTitle: formJobTitle || undefined,
        avatarBg: randomColor,
        phoneNumbers: formPhone ? [{ type: 'mobile', number: formPhone }] : [{ type: 'mobile', number: '+1 (408) 555-0100' }],
        emails: formEmail ? [{ type: 'personal', email: formEmail }] : [],
        addresses: formStreet ? [{ type: 'home', street: formStreet, city: formCity, state: 'CA', zip: '94016', country: 'USA' }] : undefined,
        notes: formNotes || undefined,
        group: formGroup,
        isFavorite: formIsFavorite,
      };
      onAddContact(newContact);
      setSelectedContactId(newContact.id);
    }

    setIsEditorOpen(false);
  };

  // Toggle favorite
  const handleToggleFavorite = (c: Contact) => {
    onUpdateContact({
      ...c,
      isFavorite: !c.isFavorite,
    });
  };

  // Export genuine vCard file
  const handleExportVCard = (c: Contact) => {
    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${c.lastName};${c.firstName};;;`,
      `FN:${c.firstName} ${c.lastName}`,
      c.company ? `ORG:${c.company}` : '',
      c.jobTitle ? `TITLE:${c.jobTitle}` : '',
      ...c.phoneNumbers.map((p) => `TEL;TYPE=${p.type.toUpperCase()}:${p.number}`),
      ...c.emails.map((e) => `EMAIL;TYPE=${e.type.toUpperCase()}:${e.email}`),
      c.addresses?.[0]
        ? `ADR;TYPE=WORK:;;${c.addresses[0].street};${c.addresses[0].city};${c.addresses[0].state};${c.addresses[0].zip};${c.addresses[0].country}`
        : '',
      c.notes ? `NOTE:${c.notes.replace(/\n/g, '\\n')}` : '',
      'END:VCARD',
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([vcardLines], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.firstName}_${c.lastName}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share Contact (copies text summary)
  const handleShareContact = (c: Contact) => {
    const text = `${c.firstName} ${c.lastName}\n${c.jobTitle ? c.jobTitle + ' - ' : ''}${c.company || ''}\nPhone: ${c.phoneNumbers[0]?.number || 'N/A'}\nEmail: ${c.emails[0]?.email || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  // Group contacts by first letter of last name
  const alphabetMap = useMemo(() => {
    const map: { [letter: string]: Contact[] } = {};
    filteredContacts.forEach((contact) => {
      const letter = (contact.lastName?.[0] || contact.firstName?.[0] || '#').toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(contact);
    });
    return map;
  }, [filteredContacts]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* App Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-black/[0.08] overflow-hidden flex flex-col md:flex-row min-h-[700px] h-[calc(100vh-140px)]">
        
        {/* 1. LEFT SIDEBAR: LISTS / GROUPS */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-zinc-200/80 bg-[#fbfbfd]">
          <div className="p-4 border-b border-zinc-200/60 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Lists
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {contacts.length} Total
            </span>
          </div>

          <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
            {groups.map((group) => {
              const count = group === 'All Contacts'
                ? contacts.length
                : group === 'Favorites'
                ? contacts.filter((c) => c.isFavorite).length
                : contacts.filter((c) => c.group === group).length;

              const isSelected = selectedGroup === group;

              return (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0071e3] text-white shadow-xs'
                      : 'text-zinc-700 hover:bg-zinc-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {group === 'Favorites' ? (
                      <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-current text-white' : 'text-amber-500'}`} />
                    ) : group === 'All Contacts' ? (
                      <Users className="w-3.5 h-3.5" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5 opacity-70" />
                    )}
                    <span>{group}</span>
                  </div>
                  <span className={`text-[11px] tabular-nums ${isSelected ? 'text-white/80' : 'text-zinc-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-zinc-200/60 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>iCloud Synced</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
          </div>
        </aside>

        {/* 2. MIDDLE COLUMN: CONTACTS LIST */}
        <section className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-zinc-200/80 bg-white ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
          {/* Search bar & Add Button */}
          <div className="p-3 border-b border-zinc-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-zinc-100 rounded-lg border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={handleOpenNewContact}
                className="p-2 text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
                title="Create New Contact"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile group pills */}
            <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {groups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                    selectedGroup === group
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Contact directory list */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {Object.keys(alphabetMap).length === 0 ? (
              <div className="p-8 text-center text-zinc-400 space-y-2">
                <Users className="w-8 h-8 mx-auto opacity-30" />
                <div className="text-xs">No contacts found</div>
              </div>
            ) : (
              Object.keys(alphabetMap).sort().map((letter) => (
                <div key={letter} className="relative">
                  <div className="sticky top-0 z-10 px-4 py-1 bg-zinc-50/90 backdrop-blur-xs text-[11px] font-semibold text-zinc-500 border-b border-zinc-100">
                    {letter}
                  </div>
                  <div className="divide-y divide-zinc-100/60">
                    {alphabetMap[letter].map((contact) => {
                      const isSelected = activeContact?.id === contact.id;
                      return (
                        <button
                          key={contact.id}
                          onClick={() => {
                            setSelectedContactId(contact.id);
                            setShowMobileDetail(true);
                          }}
                          className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#0071e3]/10 text-zinc-900 font-medium'
                              : 'hover:bg-zinc-50 text-zinc-800'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-full ${contact.avatarBg || 'bg-zinc-700'} text-white flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs`}
                          >
                            {contact.firstName[0]}{contact.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs truncate flex items-center gap-1.5">
                              <span className="font-semibold">{contact.firstName}</span>
                              <span>{contact.lastName}</span>
                              {contact.isFavorite && (
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 truncate">
                              {contact.jobTitle ? `${contact.jobTitle} · ` : ''}{contact.company || contact.phoneNumbers[0]?.number}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 text-center text-[11px] text-zinc-400 border-t border-zinc-100 bg-zinc-50/50">
            {filteredContacts.length} Contacts
          </div>
        </section>

        {/* 3. RIGHT PANE: ACTIVE CONTACT PROFILE CARD */}
        <main className={`flex-1 flex flex-col bg-white overflow-y-auto ${!showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
          {activeContact ? (
            <div className="p-6 sm:p-8 max-w-3xl mx-auto w-full space-y-6">
              
              {/* Mobile Back Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setShowMobileDetail(false)}
                  className="flex items-center gap-1 text-xs text-[#0071e3] font-medium py-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Contacts</span>
                </button>
              </div>

              {/* Header profile */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-zinc-100 text-center sm:text-left">
                <div
                  className={`w-24 h-24 rounded-full ${activeContact.avatarBg || 'bg-zinc-800'} text-white flex items-center justify-center text-3xl font-bold shadow-md shrink-0`}
                >
                  {activeContact.firstName[0]}{activeContact.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                      {activeContact.firstName} {activeContact.lastName}
                    </h1>
                    <button
                      onClick={() => handleToggleFavorite(activeContact)}
                      className="p-1 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                      title={activeContact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          activeContact.isFavorite
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-zinc-300 hover:text-zinc-500'
                        }`}
                      />
                    </button>
                  </div>

                  {activeContact.jobTitle && (
                    <div className="text-sm font-medium text-zinc-700 mt-0.5">
                      {activeContact.jobTitle}
                    </div>
                  )}
                  {activeContact.company && (
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {activeContact.company}
                    </div>
                  )}

                  <div className="text-[11px] text-zinc-400 mt-2">
                    Group: <span className="font-medium text-zinc-600">{activeContact.group}</span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditContact(activeContact)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Quick Communication Actions (Apple 4-button dock) */}
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    if (activeContact.company === 'Apple Inc.' || activeContact.id === 'contact-apple-support') {
                      onOpenLiveChat();
                    } else {
                      alert(`Opening iMessage conversation with ${activeContact.firstName}...`);
                    }
                  }}
                  className="p-3 bg-zinc-50 hover:bg-blue-50/70 border border-zinc-200/60 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <MessageSquare className="w-5 h-5 text-[#0071e3] group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-medium text-zinc-700 group-hover:text-[#0071e3] mt-1.5">
                    message
                  </span>
                </button>

                <button
                  onClick={() => {
                    const num = activeContact.phoneNumbers[0]?.number || '1-800-275-2273';
                    onInitiateCall(`${activeContact.firstName} ${activeContact.lastName}`, num, 'phone');
                  }}
                  className="p-3 bg-zinc-50 hover:bg-emerald-50/70 border border-zinc-200/60 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <Phone className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-medium text-zinc-700 group-hover:text-emerald-700 mt-1.5">
                    call
                  </span>
                </button>

                <button
                  onClick={() => {
                    const num = activeContact.phoneNumbers[0]?.number || 'FaceTime Audio/Video';
                    onInitiateCall(`${activeContact.firstName} ${activeContact.lastName}`, num, 'facetime');
                  }}
                  className="p-3 bg-zinc-50 hover:bg-blue-50/70 border border-zinc-200/60 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <Video className="w-5 h-5 text-[#0071e3] group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-medium text-zinc-700 group-hover:text-[#0071e3] mt-1.5">
                    facetime
                  </span>
                </button>

                <button
                  onClick={() => {
                    const mail = activeContact.emails[0]?.email;
                    if (mail) {
                      window.location.href = `mailto:${mail}`;
                    } else {
                      alert('No email recorded for this contact.');
                    }
                  }}
                  className="p-3 bg-zinc-50 hover:bg-purple-50/70 border border-zinc-200/60 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <Mail className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-medium text-zinc-700 group-hover:text-purple-700 mt-1.5">
                    mail
                  </span>
                </button>
              </div>

              {/* Contact Details List */}
              <div className="space-y-4">
                {/* Phone Numbers */}
                <div className="p-4 bg-zinc-50/80 rounded-xl border border-zinc-200/60 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Phone Numbers
                  </div>
                  <div className="space-y-2">
                    {activeContact.phoneNumbers.map((phone, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-zinc-500 capitalize">{phone.type}</span>
                          <div className="text-sm font-semibold text-[#0071e3] cursor-pointer hover:underline"
                            onClick={() => onInitiateCall(`${activeContact.firstName} ${activeContact.lastName}`, phone.number, 'phone')}
                          >
                            {phone.number}
                          </div>
                        </div>
                        <button
                          onClick={() => onInitiateCall(`${activeContact.firstName} ${activeContact.lastName}`, phone.number, 'phone')}
                          className="px-2.5 py-1 text-xs text-zinc-600 hover:text-black bg-white border border-zinc-200 rounded-md cursor-pointer"
                        >
                          Dial
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Addresses */}
                {activeContact.emails && activeContact.emails.length > 0 && (
                  <div className="p-4 bg-zinc-50/80 rounded-xl border border-zinc-200/60 space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Email
                    </div>
                    <div className="space-y-2">
                      {activeContact.emails.map((email, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-zinc-500 capitalize">{email.type}</span>
                            <div className="text-sm font-semibold text-[#0071e3] cursor-pointer hover:underline">
                              <a href={`mailto:${email.email}`}>{email.email}</a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Street Addresses */}
                {activeContact.addresses && activeContact.addresses.length > 0 && (
                  <div className="p-4 bg-zinc-50/80 rounded-xl border border-zinc-200/60 space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Address
                    </div>
                    {activeContact.addresses.map((addr, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs text-zinc-500 capitalize">{addr.type}</div>
                        <div className="text-sm text-zinc-900 font-medium">
                          {addr.street}
                        </div>
                        <div className="text-xs text-zinc-600">
                          {addr.city}, {addr.state} {addr.zip} {addr.country}
                        </div>
                        <div className="pt-2">
                          <button
                            onClick={() => window.open(`https://maps.apple.com/?q=${encodeURIComponent(`${addr.street}, ${addr.city}, ${addr.country}`)}`, '_blank')}
                            className="inline-flex items-center gap-1.5 text-xs text-[#0071e3] hover:underline cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Open in Apple Maps</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Birthday */}
                {activeContact.birthday && (
                  <div className="p-4 bg-zinc-50/80 rounded-xl border border-zinc-200/60 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-[11px] text-zinc-400">Birthday</div>
                      <div className="text-xs font-medium text-zinc-800">{activeContact.birthday}</div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {activeContact.notes && (
                  <div className="p-4 bg-zinc-50/80 rounded-xl border border-zinc-200/60 space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Notes
                    </div>
                    <p className="text-xs text-zinc-700 whitespace-pre-line leading-relaxed">
                      {activeContact.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Utility actions: Export vCard, Share, Delete */}
              <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportVCard(activeContact)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export vCard (.vcf)</span>
                  </button>

                  <button
                    onClick={() => handleShareContact(activeContact)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Contact</span>
                  </button>
                </div>

                {activeContact.id !== 'contact-apple-support' && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete contact "${activeContact.firstName} ${activeContact.lastName}"?`)) {
                        onDeleteContact(activeContact.id);
                      }
                    }}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Contact</span>
                  </button>
                )}
              </div>

              {/* Toast for Share */}
              {showShareToast && (
                <div className="p-2.5 bg-zinc-900 text-white text-xs rounded-lg text-center flex items-center justify-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact info copied to clipboard</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 space-y-3">
              <Users className="w-12 h-12 opacity-30" />
              <div className="text-sm">No contact selected</div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ADD / EDIT CONTACT */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-black/[0.08] p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-base font-semibold text-zinc-900">
                {isEditingExisting ? 'Edit Contact' : 'New Contact'}
              </h2>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="py-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    placeholder="Tim"
                    className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    placeholder="Cook"
                    className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Apple Inc."
                    className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formJobTitle}
                    onChange={(e) => setFormJobTitle(e.target.value)}
                    placeholder="VP, Product Design"
                    className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+1 (408) 555-0100"
                    className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="user@icloud.com"
                    className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={formStreet}
                    onChange={(e) => setFormStreet(e.target.value)}
                    placeholder="1 Apple Park Way"
                    className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Cupertino, CA"
                    className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-zinc-700 mb-1">List / Group</label>
                  <select
                    value={formGroup}
                    onChange={(e) => setFormGroup(e.target.value as Contact['group'])}
                    className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3] bg-white text-xs"
                  >
                    <option value="Apple Team">Apple Team</option>
                    <option value="Family">Family</option>
                    <option value="Work">Work</option>
                    <option value="Friends">Friends</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="fav"
                    checked={formIsFavorite}
                    onChange={(e) => setFormIsFavorite(e.target.checked)}
                    className="rounded border-zinc-300 text-[#0071e3] focus:ring-[#0071e3]"
                  />
                  <label htmlFor="fav" className="text-xs text-zinc-700 cursor-pointer">
                    Mark as Favorite
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Additional contact details or meeting notes..."
                  className="w-full p-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-lg transition-colors cursor-pointer"
                >
                  {isEditingExisting ? 'Update Contact' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
