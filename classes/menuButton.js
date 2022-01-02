//menu button extended class
class MenuButton extends Button{
    constructor(x,y,w,h,r,margin,fillColor,flashColor,id,note,volume,t,s){
        super(x,y,w,h,r,margin,fillColor,flashColor,id,note,volume);
        this.t = t;//text
        this.size = s;
    }
    render(s,sW){
		strokeWeight(sW);
		stroke(s);
		if(!this.flashStatus){
			fill(this.c);
		}else{
			fill(this.flashColor);
		}
		
		rect(this.x,this.y,this.w,this.h,this.r);

        strokeWeight(1);
        fill(0);
        noStroke();
        textAlign(CENTER,CENTER);
        textSize(this.size*this.h);
        text(this.t,this.x+this.w/2,this.y+this.h/2);
	}

    updateText(newText,s){
        this.t = newText;
        this.size = s;
    }
}