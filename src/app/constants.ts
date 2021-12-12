export class Constants {
    public static PHONE_VALIDATION = /^([1][- ])?(\(?)(\d{3})(\)?)([-. ]?)(\d{3})([-. ]?)(\d{4})$/;
    public static EMAIL_VALIDATION = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    public static ZIP_VALIDATION = /^[0-9]{5}(?:-[0-9]{4})?$/;
    public static WORD_VALIDATION = '\w';
    public static PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,32}$/;
    // public static CHECKBOX_TRUE = /^on$/i;
    public static YES_NO = /^(?:Yes|No)$/;
    public static LEN_2 = /.{2}/;
    public static MAX_LEN_10 = /.{1,10}/;
    public static MAX_LEN_25 = /.{1,25}/;
    public static MAX_LEN_50 = /.{1,50}/;
    public static MAX_LEN_100 = /.{1,100}/;
    public static MAX_LEN_200 = /.{1,200}/;
    public static MAX_LEN_500 = /.{1,500}/;
}
