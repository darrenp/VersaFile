class Search < ActiveRecord::Base

  def self.evaluate(library, query)

    where_clause=nil

    #Retrieve operator, lhs and rhs of top of query
    query.each do |q|
      op = Operator.find(q['operator_id'])
      lhs = self.evaluate_lhs(library, q['lhs'])
      rhs = self.evaluate_rhs(library, q['rhs'])

      if(op.data_type_id==Bfree::DataTypes.DateTime&&
         op.value=='=')
        d1=rhs[0].to_datetime
        d1=d1.change({:hour=>0})
        d2=d1.change({:hour=>24})

        d1=d1.to_formatted_s(:db)
        d2=d2.to_formatted_s(:db)

        rhs[0]="'#{d1}' AND '#{d2}'"
      end

      where=op.template % {:lhs=>lhs, :rhs=>rhs[0]}
      if(where_clause)
        where_clause="#{where_clause} AND #{where}"
      else
        where_clause=where
      end

    end
    logger.debug("WHERE> " + where_clause)

    return "#{where_clause}"
  end

private

  #the LHS can only be:
  #   1) a property_definition id OR
  #   2) a subquery
  def self.evaluate_lhs(library, lhs)
    clause = ''

    if(lhs.is_a?(Integer))
      propDef = library.property_definitions.find(lhs)
      clause = propDef.dbName
    else
      clause = Search.evaluate(library, lhs)
    end

    return clause
  end

  #the RHS can only be:
  #   1) an array of values
  #   2) a subquery
  def self.evaluate_rhs(library, rhs)
    clause = ''

    if(rhs.is_a?(Array))
      clause = rhs
    else
      clause = [Search.evaluate(library, rhs)]
    end

    return clause
  end


end
