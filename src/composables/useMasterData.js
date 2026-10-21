import { ref } from 'vue'
// Import konfigurasi firebase Anda di sini
// import { collection, getDocs } from 'firebase/firestore'
// import { db } from '../firebase'

const units = ref([])
const divisions = ref([])
const isLoaded = ref(false)

export function useMasterData() {
  const fetchMasterData = async () => {
    if (isLoaded.value) return // Jangan fetch lagi jika sudah ada

    try {
      // Contoh fetch dari Firebase
      // const unitSnap = await getDocs(collection(db, 'units'))
      // units.value = unitSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      isLoaded.value = true
    } catch (error) {
      console.error("Gagal mengambil data master:", error)
    }
  }

  return { units, divisions, isLoaded, fetchMasterData }
}