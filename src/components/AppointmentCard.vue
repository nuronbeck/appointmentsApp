<template>
  <v-skeleton-loader
    class="mx-auto my-5"
    min-width="374"
    transition="fade" 
    type="card"
    oulined
    :loading="isLoading"
  >
    <v-fab-transition>
        
    <v-card 
      class="mx-auto my-5"
      min-width="374"
      max-width="374"
      oulined
      :color="done ? 'light-green accent-3' : 'yellow lighten-3'"
    >      
      <v-card-title :class="done ? 'text-decoration-line-through' : ''">
        {{ name }}
      </v-card-title>

      <v-card-text>
        <v-chip class="blue accent-4 white--text">{{ date | moment("YYYY-MM-DD") }}</v-chip>
      </v-card-text>

      <v-card-text> 
        <v-expansion-panels v-model="showNote" :disabled="note === null">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <span class="text--secondary" v-if="note === null">
                Empty note
              </span>
              {{ note !== null ? 'Note': '' }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ note }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-actions>
        <v-dialog
          v-model="deleteModal"
          max-width="290"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mx-2 white--text" small color="red darken" v-bind="attrs" v-on="on" >
              <v-icon>mdi-delete</v-icon>
              Delete
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              {{ name }}
            </v-card-title>
            <v-card-text><v-chip class="blue accent-4 white--text">{{ date | moment("YYYY-MM-DD") }}</v-chip></v-card-text>
            <v-card-text>{{ note }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="grey darken-1"
                text
                @click="deleteModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="red darken-1" class="white--text"
                @click="removeAppointment"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-spacer></v-spacer>
        
        <v-checkbox
          hide-details
          class="shrink mr-2 mt-0"
          label="Done"
          color="success"
          v-model="checked"
          :value="done"
          @click="checkDone"
        ></v-checkbox>

        
      </v-card-actions>

    </v-card>
    
    </v-fab-transition>
  </v-skeleton-loader>
</template>

<script>
  export default {
    name: 'AppointmentCard',
    props: {
      onDelete: {
        type: Function,
        default: () => {}
      },
      onDone: {
        type: Function,
        default: () => {}
      },
      id: {
        type: Number,
        default: 0
      },
      date: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      note: {
        type: String,
        default: null
      },
      done: {
        type: Boolean,
        default: false
      },
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      checked(){
        return this.done
      }
    },
    data(){
      return {
        deleteModal: false,
        showNote: false
      }
    },
    methods: {
      removeAppointment(){
        this.onDelete(this.id)
      },
      checkDone(){
        this.onDone(this.id)
      }
    }
  }
</script>
