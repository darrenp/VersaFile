SERVER_HOST=https://admin.versafile.com

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
            \"email\":\"sepands@versafile.com\", \
            \"password\":\"dont4get\", \
            \"name\":\"Twin Lakes Golf Course\", \
            \"first_name\":\"Chris\", \
            \"last_name\":\"Couzelis\", \
            \"address\":\"79 Twin Lakes Road\", \
            \"city\":\"Kaleden\", \
            \"province\":\"BC\", \
            \"country\":\"CA\", \
            \"postal_code\":\"V0H 1K0\", \
            \"phone\":\"250-497-5359\", \
            \"account_type\":0, \
            \"billing_type\":0, \
            \"trial_period\":65535, \
            \"template\": 0, \
            \"subdomains\": [ { \"name\":\"tlgc\", \"user_quota\":3, \"disk_quota\": 10 } ] \
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
