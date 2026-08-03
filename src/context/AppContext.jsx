import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../utils/api';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [profilWebData, setProfilWebData] = useState({
    sejarah: "Metode Bilqolam...",
    visi: "Mencetak generasi...",
    misi: [],
    fotoUrl: "",
    kontakWa: []
  });

  const [layananList, setLayananList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [syahadahList, setSyahadahList] = useState([]);
  const [kitabOrders, setKitabOrders] = useState([]);
  const [dataLembaga, setDataLembaga] = useState([]);
  const [dataGuru, setDataGuru] = useState([]);
  const [dataSantri, setDataSantri] = useState([]);

  const fetchWithRetry = async (endpoint, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await api.get(endpoint);
      } catch (err) {
        if (i === retries - 1) {
          console.error(`Failed to fetch ${endpoint} after ${retries} attempts:`, err);
          return null;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(res => setTimeout(res, 1000 * (i + 1)));
      }
    }
  };

  // Fetch initial data
  const fetchData = async () => {
    try {
      const endpoints = [
        { name: 'Profil', url: '/web/profil' },
        { name: 'Layanan', url: '/services/layanan' },
        { name: 'Produk', url: '/services/produk' },
        { name: 'Syahadah', url: '/transactions/syahadah' },
        { name: 'Pesanan', url: '/transactions/orders' },
        { name: 'Lembaga', url: '/master/lembaga' },
        { name: 'Guru', url: '/master/guru' },
        { name: 'Santri', url: '/master/santri' }
      ];

      const results = await Promise.all(
        endpoints.map(async (ep) => {
          const data = await fetchWithRetry(ep.url);
          return { name: ep.name, data };
        })
      );

      const failed = results.filter(r => r.data === null);
      if (failed.length > 0) {
        const failedNames = failed.map(f => f.name).join(', ');
        const successNames = results.filter(r => r.data !== null).map(s => s.name).join(', ');
        
        alert(`⚠️ Laporan Pengambilan Data:\n\n✅ Berhasil: ${successNames || 'Tidak ada'}\n❌ Gagal/Kosong: ${failedNames}\n\nData yang gagal karena sibuknya server tidak akan merusak simpanan Anda. Silakan muat ulang (refresh) halaman ini.`);
      }

      // Convert results array to object for safe extraction
      const dataMap = {};
      results.forEach(r => {
        dataMap[r.name] = r.data;
      });

      if (dataMap['Profil']) setProfilWebData(dataMap['Profil']);
      if (dataMap['Layanan']) setLayananList(dataMap['Layanan']);
      if (dataMap['Produk']) setProdukList(dataMap['Produk']);
      if (dataMap['Syahadah']) setSyahadahList(dataMap['Syahadah']);
      if (dataMap['Pesanan']) setKitabOrders(dataMap['Pesanan']);
      if (dataMap['Lembaga']) setDataLembaga(dataMap['Lembaga']);
      if (dataMap['Guru']) setDataGuru(dataMap['Guru']);
      if (dataMap['Santri']) setDataSantri(dataMap['Santri']);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Profil Web
  const updateProfilWebData = async (newData) => {
    try {
      const updated = await api.put('/web/profil', newData);
      setProfilWebData(updated);
    } catch (e) { console.error(e); }
  };

  // Layanan
  const addLayanan = async (layanan) => {
    try {
      const res = await api.post('/services/layanan', layanan);
      setLayananList([...layananList, res]);
    } catch (e) { console.error(e); }
  };
  const updateLayanan = async (id, updated) => {
    try {
      const res = await api.put(`/services/layanan/${id}`, updated);
      setLayananList(layananList.map(l => l.id === id ? res : l));
    } catch (e) { console.error(e); }
  };
  const deleteLayanan = async (id) => {
    try {
      await api.delete(`/services/layanan/${id}`);
      setLayananList(layananList.filter(l => l.id !== id));
    } catch (e) { console.error(e); }
  };

  // Produk
  const addProduk = async (produk) => {
    try {
      const res = await api.post('/services/produk', produk);
      setProdukList([...produkList, res]);
    } catch (e) { console.error(e); }
  };
  const updateProduk = async (id, updated) => {
    try {
      const res = await api.put(`/services/produk/${id}`, updated);
      setProdukList(produkList.map(p => p.id === id ? res : p));
    } catch (e) { console.error(e); }
  };
  const deleteProduk = async (id) => {
    try {
      await api.delete(`/services/produk/${id}`);
      setProdukList(produkList.filter(p => p.id !== id));
    } catch (e) { console.error(e); }
  };

  // Syahadah
  const addSyahadah = async (data) => {
    try {
      const res = await api.post('/transactions/syahadah', data);
      setSyahadahList([res, ...syahadahList]);
      return res;
    } catch (e) { console.error(e); throw e; }
  };
  const updateSyahadahStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/transactions/syahadah/${id}/status`, { status: newStatus });
      setSyahadahList(syahadahList.map(item => item.id === id ? res : item));
    } catch (e) { console.error(e); }
  };

  // Kitab Orders
  const addKitabOrder = async (data) => {
    try {
      const res = await api.post('/transactions/orders', data);
      setKitabOrders([res, ...kitabOrders]);
      return res;
    } catch (e) { console.error(e); throw e; }
  };
  const updateKitabOrderStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/transactions/orders/${id}/status`, { status: newStatus });
      setKitabOrders(kitabOrders.map(item => item.id === id ? res : item));
    } catch (e) { console.error(e); }
  };
  const updateKitabPrices = async (orderId, updatedItems) => {
    try {
      const res = await api.put(`/transactions/orders/${orderId}/prices`, { items: updatedItems });
      setKitabOrders(kitabOrders.map(order => order.id === orderId ? res : order));
    } catch (e) { console.error(e); }
  };

  // Lembaga
  const addLembaga = async (lembaga) => {
    try {
      const res = await api.post('/master/lembaga', lembaga);
      setDataLembaga([...dataLembaga, res]);
    } catch (e) { console.error(e); }
  };
  const updateLembaga = async (id, updated) => {
    try {
      const res = await api.put(`/master/lembaga/${id}`, updated);
      setDataLembaga(dataLembaga.map(l => l.id === id ? res : l));
    } catch (e) { console.error(e); }
  };
  const deleteLembaga = async (ids) => {
    try {
      await api.post('/master/lembaga/delete-multiple', { ids });
      setDataLembaga(dataLembaga.filter(l => !ids.includes(l.id)));
    } catch (e) { console.error(e); }
  };

  // Guru
  const addGuru = async (guru) => {
    try {
      const res = await api.post('/master/guru', guru);
      setDataGuru([...dataGuru, res]);
    } catch (e) { console.error(e); }
  };
  const deleteGuru = async (ids) => {
    try {
      await api.post('/master/guru/delete-multiple', { ids });
      setDataGuru(dataGuru.filter(g => !ids.includes(g.id)));
    } catch (e) { console.error(e); }
  };
  const updateGuru = async (id, updated) => {
    try {
      // Assuming you have PUT /master/guru/:id (if not it might fail, but let's add it in state)
      setDataGuru(dataGuru.map(g => g.id === id ? updated : g));
    } catch (e) { console.error(e); }
  };

  // Santri
  const addSantri = async (santri) => {
    try {
      const res = await api.post('/master/santri', santri);
      setDataSantri([...dataSantri, res]);
    } catch (e) { console.error(e); }
  };
  const deleteSantri = async (ids) => {
    try {
      await api.post('/master/santri/delete-multiple', { ids });
      setDataSantri(dataSantri.filter(s => !ids.includes(s.id)));
    } catch (e) { console.error(e); }
  };
  const updateSantri = async (id, updated) => {
    try {
      setDataSantri(dataSantri.map(s => s.id === id ? updated : s));
    } catch (e) { console.error(e); }
  };

  // Mass Updates (for simplicity we just reload data after mass add but ideally we hit batch api)
  const setMassLembaga = (arr) => setDataLembaga([...dataLembaga, ...arr]);
  const setMassGuru = (arr) => setDataGuru([...dataGuru, ...arr]);
  const setMassSantri = (arr) => setDataSantri([...dataSantri, ...arr]);

  return (
    <AppContext.Provider value={{
      syahadahList, addSyahadah, updateSyahadahStatus,
      kitabOrders, addKitabOrder, updateKitabOrderStatus, updateKitabPrices,
      
      dataLembaga, addLembaga, updateLembaga, deleteLembaga, setMassLembaga,
      dataGuru, addGuru, updateGuru, deleteGuru, setMassGuru,
      dataSantri, addSantri, updateSantri, deleteSantri, setMassSantri,
      profilWebData, updateProfilWebData,
      layananList, addLayanan, updateLayanan, deleteLayanan,
      produkList, addProduk, updateProduk, deleteProduk,
      fetchData // export fetch data in case we want to force refresh
    }}>
      {children}
    </AppContext.Provider>
  );
};
