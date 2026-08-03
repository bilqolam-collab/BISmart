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

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [profil, layanan, produk, syahadah, orders, lembaga, guru, santri] = await Promise.all([
        api.get('/web/profil').catch(() => null),
        api.get('/services/layanan').catch(() => []),
        api.get('/services/produk').catch(() => []),
        api.get('/transactions/syahadah').catch(() => []),
        api.get('/transactions/orders').catch(() => []),
        api.get('/master/lembaga').catch(() => []),
        api.get('/master/guru').catch(() => []),
        api.get('/master/santri').catch(() => [])
      ]);

      if (profil) setProfilWebData(profil);
      if (layanan) setLayananList(layanan);
      if (produk) setProdukList(produk);
      if (syahadah) setSyahadahList(syahadah);
      if (orders) setKitabOrders(orders);
      if (lembaga) setDataLembaga(lembaga);
      if (guru) setDataGuru(guru);
      if (santri) setDataSantri(santri);
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
