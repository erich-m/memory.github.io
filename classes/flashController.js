//flashController class to control the flash sequencing and updating
class FlashController{
    constructor(s,d){
        this.sequence = [];

        this.s = s;//speed
        this.d = d;//difficulty
    }
    async playSequence(buttons,endCall){//flashes the buttons in the order that appears in this.sequence array
        await this.sleep(1500);
        for(var s = 0;s < (this.sequence).length;s++){//loop through all buttons in the button array for the given difficulty and flash them
            await this.sleep(1500*this.s);//use the asyncronous scheduling await and sleep to schedule the flashes
            buttons[this.d][(this.sequence)[s]].flash(this.s,true);
        }

        await this.sleep(1500);
        endCall();
    }
    sleep(timeOut){//sleep function
        return new Promise((resolve) => {
            setTimeout(resolve,timeOut);
        })
    }
    resetSequence(){//reset the sequence to make a new sequence
        this.sequence = [];
    }
    updateSequence(){//append a new number to the end of the sequence
        let index = (this.sequence).length;
        let n = (int)(random(0,pow(2,this.d+1)));
        this.sequence[index] = n;
    }
    updateSpeed(s){//update the speed setting
        this.s = s;   
    }
    updateDifficulty(d){
        this.d = d;
    }
    getSequence(){//return the sequence
        return this.sequence;
    }

}