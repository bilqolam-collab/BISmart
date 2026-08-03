import React from 'react';
import { BookOpen, GraduationCap, MapPin, Phone, Award, Shield, FileText, Activity } from 'lucide-react';

export const iconMap = {
  BookOpen: <BookOpen size={32} />,
  GraduationCap: <GraduationCap size={32} />,
  MapPin: <MapPin size={32} />,
  Phone: <Phone size={32} />,
  Award: <Award size={32} />,
  Shield: <Shield size={32} />,
  FileText: <FileText size={32} />,
  Activity: <Activity size={32} />
};

export const availableIcons = [
  { name: 'Buku Terbuka (BookOpen)', value: 'BookOpen' },
  { name: 'Topi Toga (GraduationCap)', value: 'GraduationCap' },
  { name: 'Lokasi (MapPin)', value: 'MapPin' },
  { name: 'Telepon (Phone)', value: 'Phone' },
  { name: 'Penghargaan (Award)', value: 'Award' },
  { name: 'Perisai/Keamanan (Shield)', value: 'Shield' },
  { name: 'Dokumen (FileText)', value: 'FileText' },
  { name: 'Aktivitas (Activity)', value: 'Activity' }
];
