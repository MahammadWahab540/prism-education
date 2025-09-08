import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
// removed ScrollArea to avoid nested overflow containers
import { Separator } from '@/components/ui/separator';
import { track } from '@/lib/analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  Globe, 
  Building2, 
  Brain, 
  FileText, 
  HelpCircle,
  Edit,
  Sparkles,
  Play,
  ExternalLink,
  ChevronsUpDown,
  Check,
  X
} from 'lucide-react';

type TenantOption = { name: string; slug: string; category: 'Business School' | 'Engineering' | 'Arts' | 'Test Tenants' | string };

type SkillIcon = {
  type: 'emoji' | 'image' | 'none';
  emoji?: string;
  imageUrl?: string;
  thumbUrl?: string;
  bg?: string | null;
}

// Helpers: emoji, image processing
const RECENT_EMOJI_KEY = 'nw.skill.recentEmoji';
function getEmojiCatalog(): string[] {
  const common = [
    '📘','📗','📕','📙','📚','📊','📈','📉','🧠','💡','✨','🧪','🧰','🔧','⚙️','🛠️','💻','🖥️','📱','🧮','🎯','🔬','🧫','🔭','🧷','🎓','🏫','🏛️','🏗️','🏥','🛰️','🌐','🧑\u200d🏫','🧑\u200d💻','🧑\u200d🔬','🧑\u200d🎓','📝','✏️','🖊️','🖋️','🗂️','📎','📌','🔖','🧷','🗃️','🗄️','📦','📤','📥','🧱','🎨','🎼','🎵','🎹','🎭','🎬','🎮'
  ];
  const recentRaw = localStorage.getItem(RECENT_EMOJI_KEY);
  const recent = recentRaw ? (JSON.parse(recentRaw) as string[]) : [];
  const merged = [...recent.filter((e) => common.includes(e)), ...common];
  // dedupe keep order
  return Array.from(new Set(merged));
}
function cacheRecentEmoji(icon: SkillIcon) {
  if (icon.type !== 'emoji' || !icon.emoji) return;
  const raw = localStorage.getItem(RECENT_EMOJI_KEY);
  const arr = raw ? (JSON.parse(raw) as string[]) : [];
  const next = [icon.emoji, ...arr.filter((e) => e !== icon.emoji)].slice(0, 12);
  localStorage.setItem(RECENT_EMOJI_KEY, JSON.stringify(next));
}
function getRandomEmoji(): string {
  const cats = getEmojiCatalog();
  return cats[Math.floor(Math.random() * cats.length)] || '📘';
}
async function fileToWebpAndThumb(file: File): Promise<{ imageUrl: string; thumbUrl: string }>{
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('read'));
    fr.onload = () => resolve(String(fr.result));
    fr.readAsDataURL(file);
  });
  const img = await loadImage(dataUrl);
  const imageUrl = await canvasToWebpUrl(drawSquare(img, 128));
  const thumbUrl = await canvasToWebpUrl(drawSquare(img, 32));
  return { imageUrl, thumbUrl };
}
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('load'));
    im.src = src;
  });
}
function drawSquare(img: HTMLImageElement, size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  // cover strategy
  const iw = img.width, ih = img.height;
  const s = Math.max(size / iw, size / ih);
  const sw = iw * s, sh = ih * s;
  const dx = (size - sw) / 2, dy = (size - sh) / 2;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, dx, dy, sw, sh);
  return canvas;
}
async function canvasToWebpUrl(canvas: HTMLCanvasElement): Promise<string> {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.9));
  if (!blob) throw new Error('blob');
  return URL.createObjectURL(blob);
}
async function validateImageUrl(url: string): Promise<{ ok: boolean }>{
  try {
    await loadImage(url);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
async function imageUrlToThumb(url: string): Promise<string> {
  const img = await loadImage(url);
  return canvasToWebpUrl(drawSquare(img, 32));
}

function MultiTenantCombobox({
  tenants,
  value,
  onChange,
  placeholder = 'Select tenants…',
  maxChips = 3,
  skillIcon,
}: {
  tenants: TenantOption[];
  value: TenantOption[];
  onChange: (val: TenantOption[]) => void;
  placeholder?: string;
  maxChips?: number;
  skillIcon?: SkillIcon;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const listId = 'tenant-multiselect-listbox';
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter((t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));
  }, [tenants, debounced]);

  const grouped = useMemo(() => {
    const map = new Map<string, TenantOption[]>();
    for (const t of filtered) {
      const arr = map.get(t.category) || [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const isSelected = (slug: string) => value.some((v) => v.slug === slug);
  const toggle = (opt: TenantOption) => {
    if (isSelected(opt.slug)) {
      onChange(value.filter((v) => v.slug !== opt.slug));
    } else {
      onChange([...value, opt]);
    }
  };
  const selectAll = () => {
    // Add all filtered not yet selected
    const bySlug = new Map(value.map((v) => [v.slug, true] as const));
    const next = [...value];
    for (const t of filtered) {
      if (!bySlug.has(t.slug)) next.push(t);
    }
    onChange(next);
    try { track({ name: 'skill_mgmt_tenant_filter_select', props: { slug: 'all', category: 'all' } as any }); } catch {}
  };
  const clearAll = () => { onChange([]); try { track({ name: 'skill_mgmt_tenant_filter_clear_all', props: {} as any }); } catch {} };

  const removeAt = (slug: string) => onChange(value.filter((v) => v.slug !== slug));

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) { try { track({ name: 'skill_mgmt_tenant_filter_open', props: {} as any }); } catch {} } }}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          className="w-full justify-between h-auto min-h-10 py-2"
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !open && value.length > 0) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
        >
          <div className="flex flex-wrap items-center gap-1 text-left">
            {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {value.slice(0, maxChips).map((v) => (
              <Badge key={v.slug} variant="secondary" className="flex items-center gap-1">
                {skillIcon?.type === 'emoji' && skillIcon.emoji && (
                  <span className="size-4 mr-1 align-[-2px]">{skillIcon.emoji}</span>
                )}
                {skillIcon?.type === 'image' && (skillIcon.thumbUrl || skillIcon.imageUrl) && (
                  <img src={skillIcon.thumbUrl || skillIcon.imageUrl} alt="icon" className="size-4 mr-1 rounded-[4px] object-cover align-[-2px]" loading="lazy" />
                )}
                {v.name} <span className="text-muted-foreground">({v.category})</span>
                <button
                  type="button"
                  aria-label={`Remove ${v.name}`}
                  onClick={(e) => { e.stopPropagation(); removeAt(v.slug); }}
                  className="ml-1 inline-flex"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {value.length > maxChips && (
              <Badge variant="outline">+{value.length - maxChips} more</Badge>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[9999] max-h-[400px] min-w-[12rem] overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg shadow-black/5 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 p-0 w-[420px] mb-12"
        align="start"
      >
        <Command shouldFilter={false}>
          <div className="p-2 border-b flex items-center gap-2">
            <CommandInput placeholder="Search tenants" value={query} onValueChange={setQuery} />
            <Button variant="ghost" size="sm" onClick={selectAll}>Select all</Button>
            <Button variant="ghost" size="sm" onClick={clearAll}>Clear</Button>
          </div>
          <CommandList id={listId} role="listbox" className="max-h-none">
            <CommandEmpty>No matches. Refine your search.</CommandEmpty>
            <div className="py-1">
              {grouped.map(([category, items]) => (
                <CommandGroup key={category} heading={category}>
                  {items.map((opt) => {
                    const selected = isSelected(opt.slug);
                    return (
                      <CommandItem
                        key={opt.slug}
                        role="option"
                        aria-selected={selected}
                        onSelect={() => toggle(opt)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox checked={selected} aria-label={`Select ${opt.name}`} />
                          <div className="flex flex-col">
                            <span>{opt.name}</span>
                            <span className="text-xs text-muted-foreground">{opt.slug}</span>
                          </div>
                        </div>
                        {selected && <Check className="w-4 h-4" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface Skill {
  id: string;
  name: string;
  description: string;
  scope: 'Global' | 'Tenant';
  tenantId?: string;
  tenants?: TenantOption[];
  icon?: SkillIcon;
  status: 'draft' | 'public';
  stages: Stage[];
  createdAt: Date;
}

interface Stage {
  id: string;
  name: string;
  description: string;
  link: string;
  aiTutorGenerated: boolean;
  caseStudyGenerated: boolean;
  quizGenerated: boolean;
  aiTutorContent?: string;
  caseStudyContent?: string;
  quizContent?: string;
}

// Local persistence for skills
const SKILLS_STORAGE_KEY = 'platform.skills';
function loadSkills(): Skill[] {
  try {
    const raw = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as any[];
    return parsed.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      scope: s.scope,
      tenantId: s.tenantId,
      tenants: s.tenants || [],
      icon: s.icon || { type: 'none', bg: null },
      status: s.status === 'public' ? 'public' : 'draft',
      stages: (s.stages || []).map((st: any) => ({
        id: st.id,
        name: st.name,
        description: st.description,
        link: st.link,
        aiTutorGenerated: !!st.aiTutorGenerated,
        caseStudyGenerated: !!st.caseStudyGenerated,
        quizGenerated: !!st.quizGenerated,
        aiTutorContent: st.aiTutorContent,
        caseStudyContent: st.caseStudyContent,
        quizContent: st.quizContent,
      })),
      createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
    }));
  } catch {
    return [];
  }
}
function saveSkills(list: Skill[]) {
  localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(list));
}

export function SkillManagement() {
  const [skills, setSkills] = useState<Skill[]>(() => {
    const existing = loadSkills();
    if (existing.length > 0) return existing;
    const seed: Skill = {
      id: '1',
      name: 'Quantum Computing Fundamentals',
      description: 'Master the basics of quantum computing, including qubits, superposition, and entanglement.',
      scope: 'Global',
      tenants: [],
      icon: { type: 'none', bg: null },
      status: 'draft',
      stages: [
        {
          id: 'stage-1',
          name: 'Introduction to Quantum Physics',
          description: 'Learn the fundamental principles of quantum physics and how they apply to computing.',
          link: 'https://www.youtube.com/watch?v=example1',
          aiTutorGenerated: true,
          caseStudyGenerated: true,
          quizGenerated: true,
          aiTutorContent: 'I am your AI tutor for quantum physics fundamentals. I can help you understand concepts like wave-particle duality, quantum superposition, and the uncertainty principle as they relate to quantum computing.',
          caseStudyContent: 'Case Study: IBM\'s quantum computer successfully demonstrated quantum supremacy by solving a complex optimization problem that would take classical computers thousands of years.',
          quizContent: 'Quiz: What is quantum superposition? A) A particle being in multiple states simultaneously B) A particle moving very fast C) A particle being very small'
        },
        {
          id: 'stage-2',
          name: 'Qubits and Quantum States',
          description: 'Understand how qubits work and differ from classical bits, including quantum states and measurement.',
          link: 'https://drive.google.com/file/d/example2',
          aiTutorGenerated: false,
          caseStudyGenerated: false,
          quizGenerated: false
        }
      ],
      createdAt: new Date('2024-01-15')
    };
    const list = [seed];
    saveSkills(list);
    return list;
  });

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeTab, setActiveTab] = useState("skills");
  const [isCreateSkillOpen, setIsCreateSkillOpen] = useState(false);
  const [isCreateStageOpen, setIsCreateStageOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    scope: 'Global' as 'Global' | 'Tenant',
    tenantId: ''
  });
  const [selectedTenants, setSelectedTenants] = useState<TenantOption[]>([]);
  const [iconState, setIconState] = useState<SkillIcon>({ type: 'none', bg: null });
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [draftIcon, setDraftIcon] = useState<SkillIcon>({ type: 'none', bg: null });

  // Example categorized tenant options; in real app pass via props or fetch
  const tenantOptions: TenantOption[] = [
    { name: 'Acme Business School', slug: 'acme-business', category: 'Business School' },
    { name: 'Nexa School of Business', slug: 'nexa-business', category: 'Business School' },
    { name: 'Vector Engineering', slug: 'vector-eng', category: 'Engineering' },
    { name: 'Nexa Engineering', slug: 'nexa-eng', category: 'Engineering' },
    { name: 'Orion Arts College', slug: 'orion-arts', category: 'Arts' },
    { name: 'Muse Arts Institute', slug: 'muse-arts', category: 'Arts' },
    { name: 'Staging Tenant A', slug: 'staging-a', category: 'Test Tenants' },
    { name: 'QA Sandbox', slug: 'qa-sandbox', category: 'Test Tenants' },
  ];
  const [newStage, setNewStage] = useState({
    name: '',
    description: '',
    link: ''
  });
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [savingVisible, setSavingVisible] = useState<Record<string, boolean>>({});

  const handleCreateSkill = () => {
    const skill: Skill = {
      id: Date.now().toString(),
      ...newSkill,
      tenants: newSkill.scope === 'Tenant' ? selectedTenants : [],
      icon: iconState,
      status: 'draft',
      stages: [],
      createdAt: new Date()
    };
    const next = [
      ...skills,
      skill,
    ];
    setSkills(next);
    saveSkills(next);
    setIsCreateSkillOpen(false);
    setNewSkill({
      name: '',
      description: '',
      scope: 'Global',
      tenantId: ''
    });
    setSelectedTenants([]);
    setIconState({ type: 'none', bg: null });
  };

  const updateSkillStatus = async (skill: Skill, nextStatus: 'draft' | 'public') => {
    if (nextStatus === 'public' && skill.stages.length === 0) {
      toast({ title: 'Cannot publish', description: 'Add at least one stage to publish.' });
      return;
    }
    if (skill.status === 'public' && nextStatus === 'draft') {
      const ok = window.confirm('Unpublish this skill? It will be hidden from students.');
      if (!ok) return;
    }
    setSaving((s) => ({ ...s, [skill.id]: true }));
    const timer = setTimeout(() => setSavingVisible((sv) => ({ ...sv, [skill.id]: true })), 400);
    const prevStatus = skill.status;
    const optimistic = skills.map((s) => (s.id === skill.id ? { ...s, status: nextStatus } : s));
    setSkills(optimistic);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 500));
      saveSkills(optimistic);
      toast({ title: nextStatus === 'public' ? 'Skill is now Public.' : 'Skill is now Draft.' });
    } catch (e) {
      // revert
      setSkills(skills.map((s) => (s.id === skill.id ? { ...s, status: prevStatus } : s)));
      toast({ title: "Couldn't update status" });
    } finally {
      clearTimeout(timer);
      setSaving((s) => ({ ...s, [skill.id]: false }));
      setSavingVisible((sv) => ({ ...sv, [skill.id]: false }));
    }
  };

  const handleCreateStage = () => {
    if (!selectedSkill) return;
    
    const stage: Stage = {
      id: `stage-${Date.now()}`,
      ...newStage,
      aiTutorGenerated: false,
      caseStudyGenerated: false,
      quizGenerated: false
    };

    const updatedSkills = skills.map(skill => 
      skill.id === selectedSkill.id 
        ? { ...skill, stages: [...skill.stages, stage] }
        : skill
    );
    
    setSkills(updatedSkills);
    setSelectedSkill({ ...selectedSkill, stages: [...selectedSkill.stages, stage] });
    setIsCreateStageOpen(false);
    setNewStage({
      name: '',
      description: '',
      link: ''
    });
  };

  const generateAIContent = (skillId: string, stageId: string, contentType: 'tutor' | 'caseStudy' | 'quiz') => {
    const skill = skills.find(s => s.id === skillId);
    const stage = skill?.stages.find(s => s.id === stageId);
    
    if (!skill || !stage) return;

    // Generate content based on stage description
    let generatedContent = '';
    const contentKey = `${contentType === 'tutor' ? 'aiTutor' : contentType}Content`;
    
    switch (contentType) {
      case 'tutor':
        generatedContent = `I am your AI tutor for "${stage.name}". Based on the topic: ${stage.description}. I can help you understand the key concepts, answer questions, and provide detailed explanations tailored to this specific stage.`;
        break;
      case 'caseStudy':
        generatedContent = `Case Study for "${stage.name}": Real-world application of ${stage.description}. This case study demonstrates practical implementation and industry examples related to this topic.`;
        break;
      case 'quiz':
        generatedContent = `Quiz for "${stage.name}": Test your understanding of ${stage.description}. This interactive quiz covers the key concepts and helps reinforce your learning.`;
        break;
    }

    const updatedSkills = skills.map(s => 
      s.id === skillId 
        ? {
            ...s,
            stages: s.stages.map(st => 
              st.id === stageId 
                ? {
                    ...st,
                    [`${contentType === 'tutor' ? 'aiTutor' : contentType}Generated`]: true,
                    [contentKey]: generatedContent
                  }
                : st
            )
          }
        : s
    );
    
    setSkills(updatedSkills);
    if (selectedSkill?.id === skillId) {
      setSelectedSkill(updatedSkills.find(s => s.id === skillId)!);
    }
  };

  const getLinkType = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('drive.google.com')) return 'Google Drive';
    return 'External Link';
  };

  const handleManageStages = (skill: Skill) => {
    setSelectedSkill(skill);
    setActiveTab("stages");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-luxury">Skill Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage learning skills across tenants</p>
        </div>
        <Dialog open={isCreateSkillOpen} onOpenChange={setIsCreateSkillOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent-luxury shadow-medium">
              <Plus className="w-4 h-4 mr-2" />
              Create Skill
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-2xl"
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
                e.preventDefault();
                setDraftIcon(iconState);
                setIconPickerOpen(true);
              }
            }}
          >
            <DialogHeader>
              <div className="grid grid-cols-[56px_1fr] gap-3 items-start group">
                <div className="relative">
                  <Popover open={iconPickerOpen} onOpenChange={(o) => { setIconPickerOpen(o); if (o) setDraftIcon(iconState); }}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        aria-label="Change skill icon"
                        aria-haspopup="dialog"
                        aria-expanded={iconPickerOpen}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' || e.key === 'Delete') {
                            e.preventDefault();
                            setIconState({ type: 'none', bg: null });
                          }
                        }}
                        className="size-14 rounded-2xl border border-border/50 bg-muted/30 hover:bg-muted/50 ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring overflow-hidden flex items-center justify-center text-3xl"
                      >
                        {iconState.type === 'emoji' && iconState.emoji ? (
                          <span aria-hidden className="leading-none">{iconState.emoji}</span>
                        ) : iconState.type === 'image' && (iconState.imageUrl || iconState.thumbUrl) ? (
                          <img src={iconState.imageUrl || iconState.thumbUrl} alt="Skill icon" className="size-14 object-cover" />
                        ) : (
                          <span aria-hidden className="leading-none">🙂</span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="z-[9999] w-[420px] p-0 rounded-lg border bg-popover shadow-lg">
                      <div className="p-3 border-b flex items-center justify-between">
                        <div className="font-medium">Choose icon</div>
                        {iconState.type !== 'none' && (
                          <Button variant="ghost" size="sm" onClick={() => setDraftIcon({ type: 'none', bg: null })}>Remove</Button>
                        )}
                      </div>
                      <div className="p-3">
                        <Tabs defaultValue="emoji">
                          <TabsList>
                            <TabsTrigger value="emoji">Emoji</TabsTrigger>
                            <TabsTrigger value="upload">Upload</TabsTrigger>
                            <TabsTrigger value="link">Link</TabsTrigger>
                          </TabsList>
                          <TabsContent value="emoji" className="space-y-3 pt-3">
                            <Input placeholder="Search emoji" onChange={(e) => { /* simple filter via includes on label would go here if we had labels */ }} />
                            <div className="grid grid-cols-8 gap-2 max-h-56 overflow-y-auto" role="grid">
                              {getEmojiCatalog().map((em) => (
                                <button
                                  key={em}
                                  type="button"
                                  className={`h-10 w-10 rounded-md hover:bg-muted text-2xl flex items-center justify-center ${draftIcon.type === 'emoji' && draftIcon.emoji === em ? 'ring-2 ring-ring' : ''}`}
                                  onClick={() => setDraftIcon({ type: 'emoji', emoji: em, bg: null })}
                                  aria-label={`Select emoji ${em}`}
                                >
                                  {em}
                                </button>
                              ))}
                            </div>
                            <div className="flex justify-between">
                              <Button type="button" variant="outline" size="sm" onClick={() => setDraftIcon({ type: 'emoji', emoji: getRandomEmoji(), bg: null })}>Random</Button>
                              <Button type="button" size="sm" onClick={() => { setIconState(draftIcon); cacheRecentEmoji(draftIcon); setIconPickerOpen(false); }}>Save</Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="upload" className="space-y-3 pt-3">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 512 * 1024) {
                                  toast({ title: 'Icon upload failed', description: 'File too large (max 512KB).' });
                                  return;
                                }
                                try {
                                  const { imageUrl, thumbUrl } = await fileToWebpAndThumb(file);
                                  setDraftIcon({ type: 'image', imageUrl, thumbUrl, bg: null });
                                } catch {
                                  toast({ title: 'Icon upload failed', description: 'Could not process image.' });
                                }
                              }}
                            />
                            {draftIcon.type === 'image' && draftIcon.imageUrl && (
                              <div className="flex items-center gap-3">
                                <img src={draftIcon.imageUrl} alt="Preview" className="size-14 rounded-2xl object-cover" />
                                {draftIcon.thumbUrl && <img src={draftIcon.thumbUrl} alt="Thumb" className="size-8 rounded object-cover" />}
                              </div>
                            )}
                            <div className="flex justify-end">
                              <Button type="button" size="sm" disabled={draftIcon.type !== 'image'} onClick={() => { setIconState(draftIcon); setIconPickerOpen(false); }}>Save</Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="link" className="space-y-3 pt-3">
                            <Input placeholder="https://…" onBlur={async (e) => {
                              const url = e.target.value.trim();
                              if (!url) return;
                              try {
                                const { ok } = await validateImageUrl(url);
                                if (!ok) throw new Error('Invalid');
                                const thumbUrl = await imageUrlToThumb(url);
                                setDraftIcon({ type: 'image', imageUrl: url, thumbUrl, bg: null });
                              } catch {
                                toast({ title: 'Invalid image URL', description: 'Could not load the image.' });
                              }
                            }} />
                            {draftIcon.type === 'image' && draftIcon.imageUrl && (
                              <div className="flex items-center gap-3">
                                <img src={draftIcon.imageUrl} alt="Preview" className="size-14 rounded-2xl object-cover" />
                                {draftIcon.thumbUrl && <img src={draftIcon.thumbUrl} alt="Thumb" className="size-8 rounded object-cover" />}
                              </div>
                            )}
                            <div className="flex justify-end">
                              <Button type="button" size="sm" disabled={draftIcon.type !== 'image'} onClick={() => { setIconState(draftIcon); setIconPickerOpen(false); }}>Save</Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {iconState.type === 'image' && (iconState.imageUrl || iconState.thumbUrl) && (
                    <button
                      type="button"
                      aria-label="Remove icon"
                      className="absolute -right-2 -bottom-2 z-[10000] rounded-full bg-background border shadow p-1 hover:bg-muted"
                      onClick={() => setIconState({ type: 'none', bg: null })}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <DialogTitle>Create New Skill</DialogTitle>
                    <button type="button" className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:underline" onClick={() => { setDraftIcon(iconState); setIconPickerOpen(true); }}>
                      Change icon
                    </button>
                  </div>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Skill Name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
              <Textarea
                placeholder="Skill Description"
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={newSkill.scope}
                  onValueChange={(value) => 
                    setNewSkill({ ...newSkill, scope: value as 'Global' | 'Tenant' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Global">Global - All Tenants</SelectItem>
                    <SelectItem value="Tenant">Tenant - Specific Tenant</SelectItem>
                  </SelectContent>
                </Select>
                {newSkill.scope === 'Tenant' && (
                  <div>
                    <MultiTenantCombobox
                      tenants={tenantOptions}
                      value={selectedTenants}
                      onChange={setSelectedTenants}
                      skillIcon={iconState}
                    />
                  </div>
                )}
              </div>
              <Button onClick={handleCreateSkill} className="w-full">
                Create Skill
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="skills">All Skills</TabsTrigger>
          <TabsTrigger value="stages">Stage Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <Card key={skill.id} className="glass-card hover:shadow-elevated transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {skill.icon?.type === 'emoji' && skill.icon.emoji && (
                          <span className="inline-flex items-center justify-center size-5 rounded-md bg-muted/40 text-base leading-none">{skill.icon.emoji}</span>
                        )}
                        {skill.icon?.type === 'image' && (skill.icon.thumbUrl || skill.icon.imageUrl) && (
                          <img src={skill.icon.thumbUrl || skill.icon.imageUrl} alt="icon" className="size-5 rounded-md object-cover" loading="lazy" />
                        )}
                        <CardTitle className="text-lg line-clamp-2">{skill.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {skill.scope === 'Global' ? (
                          <Badge variant="default" className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Global
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            Tenant
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                          skill.status === 'public'
                            ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/20'
                            : 'bg-muted text-foreground/70 border-transparent'
                        }`}
                      >
                        {skill.status === 'public' ? 'Public' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{skill.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{skill.stages.length} stages</span>
                    <span>{skill.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Switch
                              aria-label="Toggle public status"
                              checked={skill.status === 'public'}
                              onCheckedChange={(checked) => updateSkillStatus(skill, checked ? 'public' : 'draft')}
                              disabled={(skill.stages.length === 0 && skill.status !== 'public') || !!saving[skill.id]}
                              className="h-5 w-9"
                            />
                          </span>
                        </TooltipTrigger>
                        {(skill.stages.length === 0 && skill.status !== 'public') && (
                          <TooltipContent>Add at least one stage to publish.</TooltipContent>
                        )}
                      </Tooltip>
                      <span className="text-sm">Public</span>
                      {savingVisible[skill.id] && (
                        <span className="text-xs text-muted-foreground">Saving…</span>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleManageStages(skill)}
                      disabled={!!saving[skill.id]}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Manage Stages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          {selectedSkill ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSkill.name}</h2>
                  <p className="text-muted-foreground">{selectedSkill.stages.length} stages</p>
                </div>
                <Dialog open={isCreateStageOpen} onOpenChange={setIsCreateStageOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stage
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Stage</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Stage Name"
                        value={newStage.name}
                        onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                      />
                      <Textarea
                        placeholder="Stage Description (AI will use this to generate content)"
                        value={newStage.description}
                        onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                        rows={3}
                      />
                      <Input
                        placeholder="Stage Link (YouTube/Google Drive/Other)"
                        value={newStage.link}
                        onChange={(e) => setNewStage({ ...newStage, link: e.target.value })}
                      />
                      <Button onClick={handleCreateStage} className="w-full">
                        Add Stage
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {selectedSkill.stages.map((stage, index) => (
                  <Card key={stage.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">{stage.name}</h3>
                                <p className="text-sm text-muted-foreground">{stage.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-11 text-sm text-muted-foreground">
                              <ExternalLink className="w-4 h-4" />
                              <Badge variant="outline">{getLinkType(stage.link)}</Badge>
                              <a 
                                href={stage.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline truncate max-w-xs"
                              >
                                {stage.link}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="ml-11 space-y-4">
                          <h4 className="font-medium text-sm text-muted-foreground">AI-Generated Content</h4>
                          
                          {/* AI Tutor Section */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4" />
                                <span className="text-sm font-medium">AI Tutor</span>
                              </div>
                              {stage.aiTutorGenerated ? (
                                <Badge variant="default">Generated</Badge>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => generateAIContent(selectedSkill.id, stage.id, 'tutor')}
                                >
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Generate
                                </Button>
                              )}
                            </div>
                            {stage.aiTutorGenerated && stage.aiTutorContent && (
                              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm">{stage.aiTutorContent}</p>
                              </div>
                            )}
                          </div>

                          {/* Case Study Section */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">Case Study</span>
                              </div>
                              {stage.caseStudyGenerated ? (
                                <Badge variant="default">Generated</Badge>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => generateAIContent(selectedSkill.id, stage.id, 'caseStudy')}
                                >
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Generate
                                </Button>
                              )}
                            </div>
                            {stage.caseStudyGenerated && stage.caseStudyContent && (
                              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                <p className="text-sm">{stage.caseStudyContent}</p>
                              </div>
                            )}
                          </div>

                          {/* Quiz Section */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Quiz</span>
                              </div>
                              {stage.quizGenerated ? (
                                <Badge variant="default">Generated</Badge>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => generateAIContent(selectedSkill.id, stage.id, 'quiz')}
                                >
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Generate
                                </Button>
                              )}
                            </div>
                            {stage.quizGenerated && stage.quizContent && (
                              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                <p className="text-sm">{stage.quizContent}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {selectedSkill.stages.length === 0 && (
                  <Card className="glass-card p-12 text-center">
                    <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No stages yet</h3>
                    <p className="text-muted-foreground mb-4">Start building your skill by adding the first stage.</p>
                    <Button onClick={() => setIsCreateStageOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Stage
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card className="glass-card p-12 text-center">
              <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a skill to edit</h3>
              <p className="text-muted-foreground">Choose a skill from the "All Skills" tab to start building stages.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
