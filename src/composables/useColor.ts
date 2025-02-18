export default function useColor() {
    function random_rgba() {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
    }
    // return random_rgba()
    return ''
}
export const BLUE = '#2c3e50'
export const YELLOW = '#A97A00'
export const BACKGROUND = '#2c3e50'
export const LIGHT_BLUE = '#2c3e50'