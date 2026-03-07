<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { vMaska } from 'maska/vue'
import { useGeolocation } from './_composables/useGeolocation'
import { useCompanyActions } from './_composables/useCompanyActions'
import AppInput from '@renderer/components/form/AppInput.vue'
import AppInputNumber from '@renderer/components/form/AppInputNumber.vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

const { address, setFieldValue, handleCreate } = useCompanyActions()
const { zoom, center, marketLatLng, searchAddress } = useGeolocation()
const mapRef = useTemplateRef('refMap')

async function getLatLng() {
  const location = await searchAddress(address.street, address.number, address.department)

  if (location) {
    if (mapRef.value) {
      mapRef.value.leafletObject?.setView([location.lat, location.lng], zoom.value, {
        animate: true,
        duration: 1.0
      })
    }

    marketLatLng.value = [location.lat, location.lng]

    setFieldValue('address', `${address.street} ${address.number}, ${address.department}`)
    setFieldValue('longitude', location.lng)
    setFieldValue('latitude', location.lat)
  }
}
</script>

<template>
  <v-container fluid>
    <v-card flat class="border pa-4">
      <form @submit.prevent="handleCreate">
        <v-row class="pa-4">
          <v-col cols="12" md="6">
            <AppInput
              type="text"
              name="fantasy_name"
              label="Nombre de fantasía"
              placeholder="Carrefour"
            />
          </v-col>
          <v-col cols="12" md="6">
            <AppInput
              v-maska="'##-########-#'"
              type="text"
              name="cuit"
              label="CUIT"
              placeholder="XX-XXXXXXXX-X"
            />
          </v-col>
          <v-col cols="12" md="6">
            <AppInput type="text" name="social_reason" label="Razón social" placeholder="INC.SA" />
          </v-col>
          <v-col cols="12" md="6">
            <AppInputNumber name="social_number" label="Número social" />
          </v-col>

          <!-- Address Map -->
          <v-col cols="6">
            <v-text-field
              v-model="address.street"
              label="Calle"
              variant="outlined"
              placeholder="Avenida Hipolito Yrigoyen"
              persistent-placeholder
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="address.number"
              label="Altura"
              variant="outlined"
              placeholder="1234"
              persistent-placeholder
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="address.department"
              label="Departamento"
              variant="outlined"
              placeholder="Lanús"
              persistent-placeholder
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <div style="height: 350px; width: 100%">
              <l-map ref="refMap" :zoom="zoom" :center="center" :use-global-leaflet="false">
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  layer-type="base"
                  name="OpenStreetMap"
                ></l-tile-layer>
                <l-marker :lat-lng="marketLatLng"></l-marker>
              </l-map>
            </div>
          </v-col>

          <input type="hidden" name="address" />
          <input type="hidden" name="latitude" />
          <input type="hidden" name="longitude" />

          <v-col cols="12" class="mb-3">
            <v-btn type="button" color="primary" flat @click="getLatLng">Verificar</v-btn>
          </v-col>

          <!-- Continue Form -->
          <v-col cols="12" md="6">
            <AppInput
              type="text"
              name="contact_name"
              label="Nombre de contacto"
              placeholder="Juan Pérez"
            />
          </v-col>
          <v-col cols="12" md="6">
            <AppInput
              v-maska="'+## ## #### ####'"
              type="text"
              name="phone"
              label="Teléfono"
              placeholder="+54 9 11 1234 5678"
            />
          </v-col>

          <v-col cols="12">
            <v-btn type="submit" color="primary" flat>Guardar</v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card>
  </v-container>
</template>
