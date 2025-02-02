import { reactive } from "vue";
import { io } from "socket.io-client";
import {useRoute, useRouter} from "vue-router";

export const state = reactive({
    connected: false,
    fooEvents: [],
    barEvents: []
});

