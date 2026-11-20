import React, { useEffect, useState, useRef } from 'react';
import { Camera, Plus, Trash2, Save, UserCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AdminAboutManager = () => {
  const { setPageTitle, refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Form Fields
  const [artistName, setArtistName] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [story, setStory] = useState('');
  const [philosophy, setPhilosophy] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  // Dynamic Lists
  const [skillsMediums, setSkillsMediums] = useState([]);
  const [experienceTimeline, setExperienceTimeline] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    setPageTitle('About Page Manager');
    fetchProfile();
  }, [setPageTitle]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings/artist-profile');
      if (res.data?.success && res.data?.data) {
        const p = res.data.data;
        setArtistName(p.artistName || 'Chulbul');
        setShortBio(p.shortBio || '');
        setStory(p.story || '');
        setPhilosophy(p.philosophy || '');
        setPhotoPreview(p.photo?.url || '');
        setSkillsMediums(p.skillsMediums || []);
        setExperienceTimeline(p.experienceTimeline || []);
        setAchievements(p.achievements || []);
      }
    } catch (err) {
      toast.error('Failed to load artist profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('artistName', artistName);
      formData.append('shortBio', shortBio);
      formData.append('story', story);
      formData.append('philosophy', philosophy);
      formData.append('skillsMediums', JSON.stringify(skillsMediums));
      formData.append('experienceTimeline', JSON.stringify(experienceTimeline));
      formData.append('achievements', JSON.stringify(achievements));

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const res = await api.put('/settings/artist-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        toast.success('About page content updated successfully!');
        refreshSettings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Helper dynamic row handlers
  const addSkill = () => {
    setSkillsMediums([...skillsMediums, { name: '', experienceLevel: 'Master', description: '' }]);
  };
  const removeSkill = (index) => {
    setSkillsMediums(skillsMediums.filter((_, i) => i !== index));
  };

  const addTimeline = () => {
    setExperienceTimeline([...experienceTimeline, { year: '2026', title: '', description: '' }]);
  };
  const removeTimeline = (index) => {
    setExperienceTimeline(experienceTimeline.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    setAchievements([...achievements, { year: '2026', title: '', organization: '' }]);
  };
  const removeAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-charcoal-400">Loading artist profile editor...</div>;
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <span className="eyebrow">BIOGRAPHY & STORY</span>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            About Page Manager
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Update your artist portrait, personal journey, creative philosophy, and career milestones.
          </p>
        </div>

        <Button variant="primary" icon={Save} loading={saving} onClick={handleSave}>
          Save All Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-6">
          <h3 className="font-serif text-lg font-bold text-charcoal-900 border-b border-cream-100 pb-3">
            Artist Identity & Bio
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden bg-cream-200 border-2 border-white shadow-md shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt="Artist" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-charcoal-400">Photo</div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-charcoal-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Artist Photo
              </Button>
              <p className="text-[11px] text-charcoal-400">
                Recommended: 800x800px square photo on your studio easel.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>
          </div>

          <Input
            label="Artist Professional Name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Short Hero Bio (1-2 sentences)
            </label>
            <textarea
              rows={2}
              value={shortBio}
              onChange={(e) => setShortBio(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Full Artistic Journey & Story
            </label>
            <textarea
              rows={5}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-charcoal-700 mb-1">
              Art Philosophy Quote
            </label>
            <textarea
              rows={3}
              value={philosophy}
              onChange={(e) => setPhilosophy(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-cream-300 text-xs text-charcoal-900 leading-relaxed"
            />
          </div>
        </div>

        {/* Medium Mastery Skills */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Medium Skills & Techniques
            </h3>
            <Button variant="outline" size="sm" icon={Plus} onClick={addSkill}>
              Add Medium
            </Button>
          </div>

          <div className="space-y-3">
            {skillsMediums.map((skill, i) => (
              <div key={i} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col sm:flex-row gap-3 items-center">
                <Input
                  placeholder="Medium Name (e.g. Charcoal Realism)"
                  value={skill.name}
                  onChange={(e) => {
                    const copy = [...skillsMediums];
                    copy[i].name = e.target.value;
                    setSkillsMediums(copy);
                  }}
                  className="sm:w-1/3"
                />
                <Input
                  placeholder="Description..."
                  value={skill.description}
                  onChange={(e) => {
                    const copy = [...skillsMediums];
                    copy[i].description = e.target.value;
                    setSkillsMediums(copy);
                  }}
                  className="sm:w-1/2"
                />
                <button
                  type="button"
                  onClick={() => removeSkill(i)}
                  className="p-2 text-charcoal-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Career Experience Timeline
            </h3>
            <Button variant="outline" size="sm" icon={Plus} onClick={addTimeline}>
              Add Milestone
            </Button>
          </div>

          <div className="space-y-3">
            {experienceTimeline.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col sm:flex-row gap-3 items-center">
                <Input
                  placeholder="Year (e.g. 2022)"
                  value={item.year}
                  onChange={(e) => {
                    const copy = [...experienceTimeline];
                    copy[i].year = e.target.value;
                    setExperienceTimeline(copy);
                  }}
                  className="sm:w-28"
                />
                <Input
                  placeholder="Milestone Title"
                  value={item.title}
                  onChange={(e) => {
                    const copy = [...experienceTimeline];
                    copy[i].title = e.target.value;
                    setExperienceTimeline(copy);
                  }}
                  className="sm:w-1/3"
                />
                <Input
                  placeholder="Description of milestone"
                  value={item.description}
                  onChange={(e) => {
                    const copy = [...experienceTimeline];
                    copy[i].description = e.target.value;
                    setExperienceTimeline(copy);
                  }}
                  className="sm:w-1/2"
                />
                <button
                  type="button"
                  onClick={() => removeTimeline(i)}
                  className="p-2 text-charcoal-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              Honors & Exhibitions
            </h3>
            <Button variant="outline" size="sm" icon={Plus} onClick={addAchievement}>
              Add Award / Exhibition
            </Button>
          </div>

          <div className="space-y-3">
            {achievements.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col sm:flex-row gap-3 items-center">
                <Input
                  placeholder="Year"
                  value={item.year}
                  onChange={(e) => {
                    const copy = [...achievements];
                    copy[i].year = e.target.value;
                    setAchievements(copy);
                  }}
                  className="sm:w-28"
                />
                <Input
                  placeholder="Honor / Award Title"
                  value={item.title}
                  onChange={(e) => {
                    const copy = [...achievements];
                    copy[i].title = e.target.value;
                    setAchievements(copy);
                  }}
                  className="sm:w-1/2"
                />
                <Input
                  placeholder="Conferred by / Guild"
                  value={item.organization}
                  onChange={(e) => {
                    const copy = [...achievements];
                    copy[i].organization = e.target.value;
                    setAchievements(copy);
                  }}
                  className="sm:w-1/3"
                />
                <button
                  type="button"
                  onClick={() => removeAchievement(i)}
                  className="p-2 text-charcoal-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="primary" size="lg" icon={Save} loading={saving} type="submit">
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAboutManager;
