#SERVER_HOST=admin.bfreetest.com:3000
SERVER_HOST=admin.versafiledev.com

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
    https://$SERVER_HOST/rko_users/logon
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
        https://$SERVER_HOST/accounts/get_token \
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
            \"email\":\"scotth@rkosolutions.com\", \
            \"password\":\"dont4get\", \
            \"name\":\"CWN Capital Inc.\", \
            \"first_name\":\"Philip\", \
            \"last_name\":\"Tai\", \
            \"address\":\"55 Water Street, Suite 503\", \
            \"city\":\"Vancouver\", \
            \"province\":\"BC\", \
            \"country\":\"CA\", \
            \"postal_code\":\"V6B 1A1\", \
            \"account_type\":0, \
            \"billing_type\":0, \
            \"trial_period\":60, \
            \"template\": 0, \
            \"subdomains\": [ { \"name\":\"cwn\", \"user_quota\":3, \"disk_quota\": 10 } ] \
        }" \
    https://$SERVER_HOST/accounts
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
    https://$SERVER_HOST/rko_users/logoff
echo
echo ================================================
echo
echo

rm ./cookies.txt
