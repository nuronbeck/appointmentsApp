export default {
    namespaced: true,
    state: {
        appointments: [],
        isLoadingStored: false,
        isSavingLoading: false
    },
    mutations: {
        setLoading(state, { loaderName, loading_bool }){
            state[loaderName] = loading_bool
        },
        setAppointments(state, stored_payload){
            state.appointments = stored_payload
        },
        addAppointment(state, payload){
            state.appointments.push(payload)
            localStorage.setItem('appointments', JSON.stringify(state.appointments))
        },
        checkDoneAppointment(state, id){
            state.appointments = [...state.appointments].map((item) => {
                if(item.id === id){
                    let { done, ...rest } = item
                    return { done: !done, ...rest }
                }
                return item
            })
            localStorage.setItem('appointments', JSON.stringify(state.appointments))
        },
        deleteAppointment(state, id){
            state.appointments = [...state.appointments].filter((item) => item.id !== id)
            localStorage.setItem('appointments', JSON.stringify(state.appointments))
        }
    },
    actions: {
        LOAD_LOCALSTORAGE({commit}){
            if(localStorage.getItem('appointments') !== null && localStorage.getItem('appointments') !== 'undefined'){
                commit('setLoading', { loaderName: 'isLoadingStored', loading_bool: true })

                let appointmentsStored = JSON.parse(localStorage.getItem('appointments'))
                commit('setAppointments', appointmentsStored)
                // Demonstrate skeleton loading cards (using delay)
                setTimeout(() => commit('setLoading', { loaderName: 'isLoadingStored', loading_bool: false }), 1200)
            } else {
                commit('setAppointments', [])
            }
        },
        SAVE_LOCALSTORAGE({ commit }, appointment_payload){
            commit('setLoading', { loaderName: 'isSavingLoading', loading_bool: true })
            commit('addAppointment', appointment_payload)
            // Demonstrate actions loading 
            setTimeout(() => commit('setLoading', { loaderName: 'isSavingLoading', loading_bool: false }), 700)
        },
        CHECK_DONE_LOCALSTORAGE({ commit }, id_appointment){
            commit('setLoading', { loaderName: 'isSavingLoading', loading_bool: true })
            commit('checkDoneAppointment', id_appointment)
            // Demonstrate actions loading 
            setTimeout(() => commit('setLoading', { loaderName: 'isSavingLoading', loading_bool: false }), 700)
        },
        DELETE_LOCALSTORAGE({ commit }, id_appointment){
            commit('setLoading', { loaderName: 'isSavingLoading', loading_bool: true })
            commit('deleteAppointment', id_appointment)
            // Demonstrate actions loading 
            setTimeout(() => commit('setLoading', { loaderName: 'isSavingLoading', loading_bool: false }), 700)
        }
    },
    getters: {
        appointments: state => state.appointments,
        // appointments: state => [...state.appointments].sort((a, b) => new Date(a.date) - new Date(b.date)),
        isLoadingStored: state => state.isLoadingStored,
        isSavingLoading: state => state.isSavingLoading
    }
}