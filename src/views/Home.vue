<template>
  <v-container
    fluid
    class="grey lighten-4 fill-height align-start"
  >
    <v-row
      class="d-flex align-start justify-start flex-wrap"
      v-if="isLoadingStored"
    >
      <AppointmentCard
        v-for="(skeletonLoader, i) in 10" :key="i"
        date="Date" name="Name" :isLoading="isLoadingStored"
      />
    </v-row>


    <v-row
      class="d-flex align-start justify-start flex-wrap"
      v-if="!isLoadingStored"
    > 
      <AppointmentCard
        v-for="(appointment, i) in appointments" :key="i"
        :id="appointment.id" 
        :date="appointment.date" 
        :name="appointment.fullName" 
        :note="appointment.noteText"
        :done.sync="appointment.done"
        :onDelete="deleteAppointment" :onDone="checkAppointmentDone"
      />

    </v-row>

    <v-dialog
      v-model="dialog.active"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mx-2" fab dark color="pink" fixed bottom right v-bind="attrs" v-on="on" >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-stepper v-model="dialog.step">
        <v-stepper-header>
          <v-stepper-step
            :complete="dialog.step > 1"
            step="1"
          >
            Add Information
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :complete="dialog.step > 2"
            step="2"
          >
            Confirmation
          </v-stepper-step>

        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
  
            <form class="mb-12">

              <v-menu
                ref="menu"
                v-model="dialog.fields.menu"
                :close-on-content-click="false"
                :return-value.sync="dialog.fields.date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dialog.fields.date"
                    label="Choose date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dialog.fields.date"
                  scrollable
                  color="blue"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="dialog.fields.menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(dialog.fields.date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              
              <v-text-field
                v-model="dialog.fields.fullName"
                :error-messages="fullNameErrors"
                :counter="30"
                color="blue"
                label="Full name"
                required
                @input="$v.dialog.fields.fullName.$touch()"
                @blur="$v.dialog.fields.fullName.$touch()"
              ></v-text-field>

              <v-textarea
                v-model="dialog.fields.noteText"
                auto-grow
                color="blue"
                label="Note"
                rows="3"
              ></v-textarea>

            </form>


            <v-btn text @click="dialog.active = false">
              <v-icon
                dark
                left
              >
                mdi-cancel
              </v-icon>
              Cancel
            </v-btn>

            <v-btn
              color="primary"
              @click="nextStep(2)"
            >
              Next
              <v-icon
                dark
                right
              >
                mdi-arrow-right
              </v-icon>
            </v-btn>

          </v-stepper-content>

          <v-stepper-content step="2">
            

            <form class="mb-12">

              <v-menu
                :close-on-content-click="false"
                :return-value.sync="dialog.fields.date"
                transition="scale-transition"
                offset-y
                min-width="290px"
                disabled
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dialog.fields.date"
                    label="Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dialog.fields.date"
                  disabled
                  color="grey"
                  filled
                  readonly
                ></v-date-picker>
              </v-menu>

              <v-text-field
                v-model="dialog.fields.fullName"
                color="blue"
                label="Full name"
                filled
                readonly
              ></v-text-field>

              <v-textarea
                v-model="dialog.fields.noteText"
                auto-grow
                color="blue"
                label="Note"
                rows="3"
                filled
                readonly
              ></v-textarea>

            </form>

            <v-btn text
              @click="dialog.step = 1"
            >
              <v-icon
                dark
                left
              >
                mdi-arrow-left
              </v-icon>
              Back
            </v-btn>

            <v-btn
              color="success"
              @click="saveAppointment"
            >
              <v-icon
                dark
                left
              >
                mdi-content-save
              </v-icon>
              Save
            </v-btn>

          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

    </v-dialog>


    <v-dialog
      v-model="isSavingLoading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
import AppointmentCard from '@/components/AppointmentCard'

export default {
  mixins: [validationMixin],
  name: 'Home',
  components: {
    AppointmentCard
  },
  computed:{
    ...mapGetters({
      appointments: 'appointment/appointments',
      isLoadingStored: 'appointment/isLoadingStored',
      isSavingLoading: 'appointment/isSavingLoading'
    }),
    fullNameErrors () {
      const errors = []
      if (!this.$v.dialog.fields.fullName.$dirty) return errors
      !this.$v.dialog.fields.fullName.required && errors.push('Enter full name!')
      !this.$v.dialog.fields.fullName.maxLength && errors.push('Max length 30 symbols!')
      return errors
    }
  },
  data(){
    return {
      dialog: {
        active: false,
        step: 1,
        fields: {
          // Date menu
          menu: false,
          date: new Date().toISOString().substr(0, 10),
          // Full name and note
          fullName: null,
          noteText: null
        }
      }
    }
  },
  validations: {
    dialog: {
      fields: {
        date: { required },
        fullName: { required, maxLength: maxLength(30) }
      }
    }
  },
  mounted(){
    this.LOAD_LOCALSTORAGE()
  },
  methods: {
    ...mapActions({
      SAVE_LOCALSTORAGE: 'appointment/SAVE_LOCALSTORAGE',
      LOAD_LOCALSTORAGE: 'appointment/LOAD_LOCALSTORAGE',
      DELETE_LOCALSTORAGE: 'appointment/DELETE_LOCALSTORAGE',
      CHECK_DONE_LOCALSTORAGE: 'appointment/CHECK_DONE_LOCALSTORAGE'
    }),
    nextStep(step_number){
      this.$v.$touch()

      if(!this.$v.$invalid){
        this.dialog.step = step_number
      }
    },
    initFormClearInstance(){
      this.dialog.active = false
      this.dialog.step = 1 
      this.dialog.fields.date = new Date().toISOString().substr(0, 10),
      this.dialog.fields.fullName = null
      this.dialog.fields.noteText = null
      this.$v.$reset()
    },
    saveAppointment(){
      let { date, fullName, noteText } = this.dialog.fields
      this.SAVE_LOCALSTORAGE({ done: false, id: new Date().getTime(), date, fullName, noteText })
      
      this.$toast.success("Saved successfully!", {
        timeout: 3000
      });
      this.initFormClearInstance()
    },
    deleteAppointment(id){
      this.DELETE_LOCALSTORAGE(id)
      this.$toast.success("Successfully deleted!", {
        timeout: 3000
      });
    },
    checkAppointmentDone(id){
      this.CHECK_DONE_LOCALSTORAGE(id)
    }
  }
}
</script>
