
/**
 * Music player API implementation which uses the Browsers own Audio object
 * 
    Copyright 2020 Phil Schatzmann

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import WebService from "@/services/WebService"
import store from '@/store/index';

export default class MusicPlayer {
    constructor(){
        if (MusicPlayer.isPlaying ===undefined){
            MusicPlayer.audio = null;
            MusicPlayer.isPlaying = false
            this.service = new WebService()
        }
    }

    getName() {
        return "Playing locally"
    }

    async play(url){
        await this.stop();
        try {
            var result = await this.setup();
            if (result){
                MusicPlayer.audio = new Audio(url);
                await MusicPlayer.audio.play();
                MusicPlayer.isPlaying = true
                console.info("MusicPlayer -> OK")
                return  {url : url, playing:true }  
            } else {
                return  {url : url, playing:false }  
            }
        } catch(error){
            console.error(error)
            return  {url : url, playing:false } 
        }
    }

    async setup() {
        if (store.state.esp32){
            // make sure that bleutooth is active on esp32
            var response = await this.service.postBluetooth(true);
            return response.data.bluetooth 
        } else {
            return true;
        }
    }

    async stop() {
        if (MusicPlayer.audio!=null) {
            try {
                MusicPlayer.audio.pause();
            } catch(ex){
                console.log.error(ex)
            }
            MusicPlayer.audio = null;
        }
        MusicPlayer.isPlaying = false
    }

    async getInfo() {
        return {'isPlaying': MusicPlayer.isPlaying};
    }

    isPlaying(){
        return MusicPlayer.isPlaying;
    }


}
