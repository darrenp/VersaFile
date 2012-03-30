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
            \"name\":\"Ripples Kitchen and Bath\", \
            \"first_name\":\"Brent\", \
            \"last_name\":\"Black\", \
            \"address\":\"3272 Main Street\", \
            \"city\":\"Vancouver\", \
            \"province\":\"BC\", \
            \"country\":\"CA\", \
            \"postal_code\":\"V5V 3M5\", \
            \"phone\":\"604-879-6999\", \
            \"account_type\":0, \
            \"billing_type\":0, \
            \"trial_period\":65535, \
            \"template\": 0, \
            \"subdomains\": [ { \"name\":\"ripples\", \"user_quota\":3, \"disk_quota\": 10 } ] \
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
