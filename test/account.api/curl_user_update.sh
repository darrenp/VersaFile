SERVER_HOST=admin.bfreetest.com:3000
#SERVER_HOST=admin.versafiledev.com

echo LOGON
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -d "{\"email\":\"cmburns@snpp.com\",\"password\":\"bobo\"}" \
    http://$SERVER_HOST/accounts/logon
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
        http://$SERVER_HOST/accounts/get_token \
)
echo
echo ================================================
echo
echo

curr_date=$( date +"%y%m%d%H%M%S" )

echo UPDATE - OK
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -X PUT \
    -d "{ \
            \"authenticity_token\":\"$auth_token\",
            \"customer_code\":\"$curr_date\", \
            \"name\":\"Springfield Nuclear Power Plant [$curr_date]\", \
            \"first_name\":\"C. Montgomery [$curr_date]\", \
            \"last_name\":\"Burns [$curr_date]\", \
            \"address\":\"55 Water Street, Suite 503 [$curr_date]\", \
            \"city\":\"Vancouver [$curr_date]\", \
            \"province\":\"BC [$curr_date]\", \
            \"country\":\"CA [$curr_date]\", \
            \"postal_code\":\"V6B 1A1 [$curr_date]\", \
            \"account_type\":1, \
            \"billing_type\":1, \
            \"trial_period\":120, \
            \"subdomains\": [ { \"name\":\"nuke\", \"user_quota\":12, \"disk_quota\": 52 } ] \
        }" \
    http://$SERVER_HOST/accounts/cmburns@snpp.com
echo
echo ================================================
echo
echo

echo UPDATE - SINGLE ATTRIBUTE - OK
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -X PUT \
    -d "{ \
            \"authenticity_token\":\"$auth_token\",
            \"name\":\"Springfield Nuclear Power Plant [$curr_date] - X\", \
            \"subdomains\": [ { \"name\":\"nuke\", \"disk_quota\": 53 } ] \
        }" \
    http://$SERVER_HOST/accounts/cmburns@snpp.com
echo
echo ================================================
echo
echo

echo UPDATE - OTHER ACCOUNT - FAIL
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -X PUT \
    -d "{ \
            \"authenticity_token\":\"$auth_token\",
            \"customer_code\":\"$curr_date\", \
            \"name\":\"Kwik-E-Mart [$curr_date]\", \
            \"first_name\":\"Apu [$curr_date]\", \
            \"last_name\":\"Nahasapeemapetilon [$curr_date]\", \
            \"address\":\"55 Water Street, Suite 503 [$curr_date]\", \
            \"city\":\"Vancouver [$curr_date]\", \
            \"province\":\"BC [$curr_date]\", \
            \"country\":\"CA [$curr_date]\", \
            \"postal_code\":\"V6B 1A1 [$curr_date]\", \
            \"account_type\":2, \
            \"billing_type\":2, \
            \"trial_period\":90, \
            \"subdomains\": [ { \"name\":\"nuke\", \"user_quota\":10, \"disk_quota\": 50 } ] \
        }" \
    http://$SERVER_HOST/accounts/anahasapeemapetilon@kwikemart.com
echo
echo ================================================
echo
echo

echo UPDATE PASSWORD - OK
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -X PUT \
    -d "{ \
            \"authenticity_token\":\"$auth_token\",
            \"customer_code\":\"$curr_date\", \
            \"name\":\"Springfield Nuclear Power Plant [$curr_date]\", \
            \"first_name\":\"C. Montgomery [$curr_date]\", \
            \"last_name\":\"Burns [$curr_date]\", \
            \"address\":\"55 Water Street, Suite 503 [$curr_date]\", \
            \"city\":\"Vancouver [$curr_date]\", \
            \"province\":\"BC [$curr_date]\", \
            \"country\":\"CA [$curr_date]\", \
            \"postal_code\":\"V6B 1A1 [$curr_date]\", \
            \"account_type\":1, \
            \"billing_type\":1, \
            \"trial_period\":120, \
            \"password\": \"bobo\", \
            \"new_password\": \"smithers\", \
            \"subdomains\": [ { \"name\":\"nuke\", \"user_quota\":10, \"disk_quota\": 50 } ] \
        }" \
    http://$SERVER_HOST/accounts/cmburns@snpp.com
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
    -d "{\"authenticity_token\":\"$auth_token\"}" \
    http://$SERVER_HOST/accounts/logoff
echo
echo ================================================
echo
echo

echo LOGON - NEW PASSWORD
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -d "{\"email\":\"cmburns@snpp.com\",\"password\":\"smithers\"}" \
    http://$SERVER_HOST/accounts/logon
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
        http://$SERVER_HOST/accounts/get_token \
)
echo
echo ================================================
echo
echo

echo UPDATE PASSWORD - OK
echo ================================================
curl \
    -v \
    -b cookies.txt \
    -c cookies.txt \
    -H "Accept:application/json,application/javascript" \
    -H "Content-Type:application/json" \
    -X PUT \
    -d "{ \
            \"authenticity_token\":\"$auth_token\",
            \"customer_code\":\"$curr_date\", \
            \"name\":\"Springfield Nuclear Power Plant [$curr_date]\", \
            \"first_name\":\"C. Montgomery [$curr_date]\", \
            \"last_name\":\"Burns [$curr_date]\", \
            \"address\":\"55 Water Street, Suite 503 [$curr_date]\", \
            \"city\":\"Vancouver [$curr_date]\", \
            \"province\":\"BC [$curr_date]\", \
            \"country\":\"CA [$curr_date]\", \
            \"postal_code\":\"V6B 1A1 [$curr_date]\", \
            \"account_type\":1, \
            \"billing_type\":1, \
            \"trial_period\":120, \
            \"password\": \"smithers\", \
            \"new_password\": \"bobo\", \
            \"subdomains\": [ { \"name\":\"nuke\", \"user_quota\":10, \"disk_quota\": 50 } ] \
        }" \
    http://$SERVER_HOST/accounts/cmburns@snpp.com
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
    -d "{\"authenticity_token\":\"$auth_token\"}" \
    http://$SERVER_HOST/accounts/logoff
echo
echo ================================================
echo
echo

rm ./cookies.txt