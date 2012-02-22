#SERVER_HOST=http://admin.bfreetest.com:3000
SERVER_HOST=https://admin.versafiletest.com
#SERVER_HOST=https://admin.versafile.com

echo LOGON
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -k \
    -d "{\"username\":\"admin\",\"password\":\"admin\"}" \
    $SERVER_HOST/rko_users/logon
echo
echo ================================================
echo
echo

echo GET TOKEN
echo ================================================
auth_token=$( \
    curl \
        -v \
        -b cookies.txt \
        -c cookies.txt \
        -H "Accept:application/json,application/javascript" \
        -H "Content-Type:application/json" \
        -k \
        $SERVER_HOST/accounts/get_token \
)
echo
echo ================================================
echo
echo

echo CREATE
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -k \
    -X POST \
    -d "{ \
            \"authenticity_token\":\"$auth_token\",
            \"email\":\"mikes@rkosolutions.com\", \
            \"password\":\"dont4get\", \
            \"name\":\"RKO Business Solutions\", \
            \"first_name\":\"Adam\", \
            \"last_name\":\"Petrie\", \
            \"address\":\"55 Water Street, Suite 503\", \
            \"city\":\"Vancouver\", \
            \"province\":\"BC\", \
            \"country\":\"CA\", \
            \"postal_code\":\"V6B 1A1\", \
            \"account_type\":1, \
            \"billing_type\":0, \
            \"trial_period\":-1, \
            \"template\": 0, \
            \"subdomains\": [ { \"name\":\"rko\", \"user_quota\":10, \"disk_quota\": 50 } ] \
        }" \
    $SERVER_HOST/accounts
echo
echo ================================================
echo
echo

echo LOGOFF
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -k \
    -d "{\"authenticity_token\":\"$auth_token\"}" \
    $SERVER_HOST/rko_users/logoff
echo
echo ================================================
echo
echo

rm ./cookies.txt
